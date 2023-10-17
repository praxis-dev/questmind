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
    "pydantic"
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/questions/questions.txt", remote_path="/app/data/questions/questions.txt"
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/texts/combined_corpus.txt", remote_path="/app/data/texts/combined_corpus.txt"
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/src/llama-2-13b-chat.Q4_K_M.gguf", remote_path="/app/model/llama-2-13b-chat.Q4_K_M.gguf"
)

stub = modal.Stub("model_modal")
volume = modal.NetworkFileSystem.persisted("mindquest-storage-vol")

DATA_PATH = "/app/data/texts"
DB_FAISS_PATH = "/app/vectorstores/db_faiss"
QUESTIONS_PATH = '/app/data/questions/questions.txt'
PHILOSOPHICAL_EMBEDDINGS_PATH = '/app/vectorstores'
LLM_PATH = "/app/model/llama-2-13b-chat.Q4_K_M.gguf"


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

@stub.function(image=image, gpu="T4", network_file_systems={PHILOSOPHICAL_EMBEDDINGS_PATH: volume})
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

@stub.function(image=image, gpu="T4", network_file_systems={DB_FAISS_PATH: volume})
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
    
    
@stub.function(image=image, gpu="T4", network_file_systems={PHILOSOPHICAL_EMBEDDINGS_PATH: volume})
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
   
@stub.function(image=image, gpu="T4", network_file_systems={DB_FAISS_PATH: volume})
@web_endpoint(method="POST")
def get_response(request: RequestModel) -> str:
    query = request.query 
    print("Initializing the QA bot.")
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import FAISS
    from langchain.llms import CTransformers
    from langchain.chains import RetrievalQA

    import os
    
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={"device": detect_device.remote()})
    created_files = os.listdir(DB_FAISS_PATH)
    for file in created_files:
        print(file)

    db = FAISS.load_local(DB_FAISS_PATH, embeddings)
    llm = CTransformers(
        model=LLM_PATH,
        model_type="llama",
        config=config
    )
    qa_prompt = set_custom_prompt.remote()
    
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
    