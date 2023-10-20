import sys

from pydantic import BaseModel

import modal

from modal import Image, web_endpoint

image = Image.debian_slim().pip_install(
    "torch",
    "sentence-transformers",
    "faiss-cpu",
    "langchain",
    "ctransformers[cuda]",
    "pydantic",
    "accelerate",
    "transformers",
    "bitsandbytes"
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/questions/questions.txt", remote_path="/app/data/questions/questions.txt"
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/texts/combined_corpus.txt", remote_path="/app/data/texts/combined_corpus.txt"
)

stub = modal.Stub("model_modal")
volume = modal.NetworkFileSystem.persisted("mindquest-storage-vol")

DATA_PATH = "/app/data/texts"
DB_FAISS_PATH = "/app/vectorstores/db_faiss"
QUESTIONS_PATH = '/app/data/questions/questions.txt'
PHILOSOPHICAL_EMBEDDINGS_PATH = '/app/vectorstores'

config = {'max_new_tokens': 900, 'repetition_penalty': 1.1,
          "temperature": 0.6, "context_length": 1024, "gpu_layers": 50
          }

custom_prompt_template = """You are philosopher Seneca. Use your wisdom to help the one who is asking for your advice. You answer in his literary style. In your responses, you call the person who asks you for advice only "my friend" without calling him Lucilius or any other name.

Context: {context}
Question: {question}

Useful answer of Seneca without citing or making up quotes from other philosophers:
"""


@stub.function(image=image, gpu="T4")
def detect_device():
    import torch
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")

@stub.function(image=image, gpu="T4", network_file_systems={PHILOSOPHICAL_EMBEDDINGS_PATH: volume}, allow_cross_region_volumes=True)
def ingest_questions():
    print("Starting the ingestion of questions.")
    import torch
    from sentence_transformers import SentenceTransformer, util

    questions = []

    with open(QUESTIONS_PATH, 'r') as file:
        for line in file:
            line = line.strip()
            if line and not line.startswith('#'):
                questions.append(line)
    print(questions[:10])
    model_st = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device=detect_device.remote())
    philosophical_embeddings = model_st.encode(questions)
    torch.save(philosophical_embeddings, PHILOSOPHICAL_EMBEDDINGS_PATH + "/philosophical_embeddings.pt")
    print("Finished the creation of embeddings.")

@stub.function(image=image, gpu="T4", network_file_systems={DB_FAISS_PATH: volume}, allow_cross_region_volumes=True)
def create_vector_db():
    from langchain.document_loaders import DirectoryLoader, TextLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import FAISS
    import os

    print("Starting the creation of vector database.")

    loader = DirectoryLoader(DATA_PATH, glob="*.txt", loader_cls=TextLoader)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=25)
    texts = text_splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": detect_device.remote()}
    )

    db = FAISS.from_documents(texts, embeddings)
    db.save_local(DB_FAISS_PATH)

    print("DB saved")
    
    
@stub.function(image=image, gpu="T4", network_file_systems={PHILOSOPHICAL_EMBEDDINGS_PATH: volume}, allow_cross_region_volumes=True)
def is_philosophy_related(text):
    import torch

    from sentence_transformers import SentenceTransformer, util

    print("Checking if the text is philosophy-related.")
    model_st = SentenceTransformer(
    'sentence-transformers/all-MiniLM-L6-v2', device=detect_device.remote())
    philosophical_embeddings = torch.load(PHILOSOPHICAL_EMBEDDINGS_PATH + "/philosophical_embeddings.pt")

    text_embedding = model_st.encode(text)
    similarities = [util.pytorch_cos_sim(
        text_embedding, ref_emb).item() for ref_emb in philosophical_embeddings]
    return max(similarities) > 0.3

@stub.function(image=image, gpu="T4")
def set_custom_prompt():
    from langchain.prompts import PromptTemplate 
    
    prompt = PromptTemplate(template=custom_prompt_template, input_variables=[
                            'context', 'question'])
    return prompt

@stub.function(image=image, gpu="T4")
def postprocessing(text):
    print("Postprocessing the response.")

    if text.endswith('.'):
        return text
    elif '.' in text:
        last_dot_position = text.rfind('.')
        return text[:last_dot_position + 1]
    else:
        return text
    
class RequestModel(BaseModel):
    query: str
   
@stub.function(image=image, gpu="T4", network_file_systems={DB_FAISS_PATH: volume}, allow_cross_region_volumes=True)
@web_endpoint(method="POST")
def get_response(request: RequestModel) -> str:
    print("Initializing the QA bot.")

    query = request.query 
    
    import torch
    import transformers
    from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
    from langchain import HuggingFacePipeline, LLMChain, PromptTemplate
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import FAISS
    from langchain.chains import RetrievalQA

    import os

    import json
    import textwrap
    
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={"device": detect_device.remote()})
    
    created_files = os.listdir(DB_FAISS_PATH)
    for file in created_files:
        print(file)
    
    
    db = FAISS.load_local(DB_FAISS_PATH, embeddings)
    
    qa_prompt = set_custom_prompt.remote()

    tokenizer = AutoTokenizer.from_pretrained("NousResearch/Llama-2-7b-chat-hf")
    
    model = AutoModelForCausalLM.from_pretrained("NousResearch/Llama-2-7b-chat-hf",
                                             device_map='auto',
                                             torch_dtype=torch.float16,
                                             load_in_4bit=True,
                                             bnb_4bit_quant_type="nf4",
                                             bnb_4bit_compute_dtype=torch.float16)
    
    pipe = pipeline("text-generation",
                model=model,
                tokenizer= tokenizer,
                torch_dtype=torch.float16,
                device_map="auto",
                max_new_tokens = 512,
                do_sample=True,
                top_k=30,
                num_return_sequences=1,
                eos_token_id=tokenizer.eos_token_id
                )
    
    B_INST, E_INST = "[INST]", "[/INST]"
    B_SYS, E_SYS = "<>\n", "\n<>\n\n"
    DEFAULT_SYSTEM_PROMPT = """\
    You are an advanced Life guru and mental health expert that excels at giving advice.
    Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.
    If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.Just say you don't know and you are sorry!"""

    def get_prompt(instruction, new_system_prompt=DEFAULT_SYSTEM_PROMPT, citation=None):
        SYSTEM_PROMPT = B_SYS + new_system_prompt + E_SYS
        prompt_template =  B_INST + SYSTEM_PROMPT + instruction + E_INST

        if citation:
            prompt_template += f"\n\nCitation: {citation}"  # Insert citation here

        return prompt_template

    def cut_off_text(text, prompt):
        cutoff_phrase = prompt
        index = text.find(cutoff_phrase)
        if index != -1:
            return text[:index]
        else:
            return text

    def remove_substring(string, substring):
        return string.replace(substring, "")

    def generate(text, citation=None):
        prompt = get_prompt(text, citation=citation)
        inputs = tokenizer(prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = model.generate(**inputs,
                                    max_length=512,
                                    eos_token_id=tokenizer.eos_token_id,
                                    pad_token_id=tokenizer.eos_token_id,
                                    )
            final_outputs = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
            final_outputs = cut_off_text(final_outputs, '')
            final_outputs = remove_substring(final_outputs, prompt)

        return final_outputs

    def parse_text(text):
        wrapped_text = textwrap.fill(text, width=100)
        print(wrapped_text + '\n\n')
        
        
    llm = HuggingFacePipeline(pipeline = pipe, model_kwargs = {'temperature':0.7,'max_length': 256, 'top_k' :50})


    system_prompt = "You are an advanced Life guru and mental health expert that excels at giving advice. "
    instruction = "Convert the following input text from a stupid human to a well-reasoned and step-by-step throughout advice:\n\n {text}"
    template = get_prompt(instruction, system_prompt)
    print(template)
    
    prompt = PromptTemplate(template=template, input_variables=["text"])

    llm_chain = LLMChain(prompt=prompt, llm=llm, verbose = False)



        
    

    



    
    qa_chain = RetrievalQA.from_chain_type(llm=llm,
                                           chain_type='stuff',
                                           retriever=db.as_retriever(
                                               search_kwargs={'k': 2}),
                                           return_source_documents=False,
                                           chain_type_kwargs={'prompt': qa_prompt})
    
    if not is_philosophy_related.remote(query):
        return ("This is not my area of expertise.")
    
    response_dict = qa_chain({'query': query})  

    response_text = response_dict.get('result', '')

    refined_response = postprocessing.remote(response_text)
    return refined_response


@stub.local_entrypoint()
def main():
    print("Device:", detect_device.remote())
    create_vector_db.remote()
    ingest_questions.remote()
    