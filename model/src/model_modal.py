from pydantic import BaseModel

import modal

from modal import Image, web_endpoint

image = Image.debian_slim().pip_install(
    "torch",
    "sentence-transformers",
    "langchain",
    "pydantic",
    "accelerate",
    "transformers",
    "bitsandbytes",
    "openai",
    "cohere",
    "tiktoken",
    "faiss-gpu",
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/questions/questions.txt", remote_path="/app/data/questions/questions.txt"
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/texts/combined_corpus.txt", remote_path="/app/data/texts/combined_corpus.txt")


stub = modal.Stub("model_modal")
data_volume = modal.NetworkFileSystem.persisted("data_volume")
db_faiss_volume = modal.NetworkFileSystem.persisted("db_faiss_volume")
questions_volume = modal.NetworkFileSystem.persisted("questions_volume")
philosophical_embeddings_volume = modal.NetworkFileSystem.persisted("philosophical_embeddings_volume")
model_files_volume = modal.NetworkFileSystem.persisted("model_files_volume")

DATA_PATH = "/app/data/texts"
DB_FAISS_PATH = "/app/vectorstores/db_faiss"
QUESTIONS_PATH = '/app/data/questions/questions.txt'
PHILOSOPHICAL_EMBEDDINGS_PATH = '/app/vectorstores'

@stub.function(image=image, gpu="T4", network_file_systems={PHILOSOPHICAL_EMBEDDINGS_PATH: philosophical_embeddings_volume}, allow_cross_region_volumes=True)
def ingest_questions():
    print("Starting the ingestion of questions.")
    import torch
    from sentence_transformers import SentenceTransformer

    questions = []

    with open(QUESTIONS_PATH, 'r') as file:
        for line in file:
            line = line.strip()
            if line and not line.startswith('#'):
                questions.append(line)
    print(questions[:10])
    model_st = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device="cuda")
    philosophical_embeddings = model_st.encode(questions)
    torch.save(philosophical_embeddings, PHILOSOPHICAL_EMBEDDINGS_PATH + "/philosophical_embeddings.pt")
    print("Finished the creation of embeddings.")

@stub.function(image=image, gpu="T4", network_file_systems={DB_FAISS_PATH: db_faiss_volume}, allow_cross_region_volumes=True)
def create_vector_db():
    from langchain.embeddings.openai import OpenAIEmbeddings
    from langchain.document_loaders import DirectoryLoader, TextLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.vectorstores import FAISS
    import os

    print("Starting the creation of vector database.")

    openai_api_key = "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"

    loader = DirectoryLoader(DATA_PATH, glob="*.txt", loader_cls=TextLoader)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=25)
    texts = text_splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

    db = FAISS.from_documents(texts, embeddings)
    db.save_local(DB_FAISS_PATH)

    print(os.listdir(DB_FAISS_PATH))

    print("DB saved")
    
    
@stub.function(image=image, gpu="T4", network_file_systems={PHILOSOPHICAL_EMBEDDINGS_PATH: philosophical_embeddings_volume}, allow_cross_region_volumes=True)
def is_philosophy_related(text):
    import torch

    from sentence_transformers import SentenceTransformer, util

    print("Checking if the text is philosophy-related.")
    model_st = SentenceTransformer(
    'sentence-transformers/all-MiniLM-L6-v2', device="cuda")
    philosophical_embeddings = torch.load(PHILOSOPHICAL_EMBEDDINGS_PATH + "/philosophical_embeddings.pt")

    text_embedding = model_st.encode(text)
    similarities = [util.pytorch_cos_sim(
        text_embedding, ref_emb).item() for ref_emb in philosophical_embeddings]
    return max(similarities) > 0.3
    
class RequestModel(BaseModel):
    query: str
   
@stub.function(image=image, gpu="T4", network_file_systems={DB_FAISS_PATH: db_faiss_volume}, allow_cross_region_volumes=True, timeout=600)
@web_endpoint(method="POST")
def get_response(request: RequestModel) -> str:
      
    from langchain.llms import OpenAI
    from langchain.embeddings.openai import OpenAIEmbeddings
    from langchain.prompts import PromptTemplate
    from langchain.chains import LLMChain
    from langchain.chains import RetrievalQA
    from langchain.prompts import PromptTemplate
    from langchain.vectorstores import FAISS
    
    query = request.query
    
    if not is_philosophy_related.remote(query):
        return ("This is not my area of expertise.")

    openai_api_key = "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"

    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

    db = FAISS.load_local(DB_FAISS_PATH, embeddings)

    prompt_template = """
    
    You are philosopher Seneca. Use your wisdom to help the one who is asking for your advice. You provide elaborate, comprehensive and encouraging answers in his literary style. You analyze the question and provide instructions for your apprentice so he or she could become a better human being. In your responses, you call the person who asks you for advice only "my friend" without calling him Lucilius or any other name.

    {context}

    Question: {question}
    Useful answer of Seneca without citing or making up quotes from other philosophers:
    """
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    chain_type_kwargs = {"prompt": PROMPT}

    qa = RetrievalQA.from_chain_type(llm=OpenAI(temperature=0.9, openai_api_key=openai_api_key), chain_type="stuff", retriever=db.as_retriever(), chain_type_kwargs=chain_type_kwargs)

    response = qa.run(query)
    return response


@stub.local_entrypoint()
def main():
    create_vector_db.remote()
    ingest_questions.remote()
    