import sys

import logging

import modal

from modal import Image

image = Image.debian_slim().pip_install(
    "torch",
    "sentence-transformers",
    "faiss-cpu",
    "langchain"
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/questions/questions.txt", remote_path="/app/data/questions/questions.txt"
).copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/texts/combined_corpus.txt", remote_path="/app/data/texts/combined_corpus.txt"
)

stub = modal.Stub("model_modal")

DATA_PATH = "/app/data/texts"
DB_FAISS_PATH = "/app/vectorstores/db_faiss"
QUESTIONS_PATH = '/app/data/questions/questions.txt'

@stub.function(image=image, gpu="any")
def detect_device():
    import torch
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")

@stub.function(image=image, gpu="any")
def ingest_questions():
    logging.info("Starting the ingestion of questions.")

    questions = []

    with open(QUESTIONS_PATH, 'r') as file:
        for line in file:
            line = line.strip()
            if line and not line.startswith('#'):
                questions.append(line)
    print(questions[:10])
    return questions

@stub.function(image=image, gpu="any")
def create_vector_db():
    from langchain.document_loaders import DirectoryLoader, TextLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import FAISS

    logging.info("Starting the creation of vector database.")

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

    logging.info("Finished creating vector database.")



@stub.local_entrypoint()
def main():
    print("Device:", detect_device.remote())
    ingest_questions.remote()
    create_vector_db.remote()
    