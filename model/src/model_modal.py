import sys


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

config = {'max_new_tokens': 900, 'repetition_penalty': 1.1,
          "temperature": 0.6, "context_length": 1024, "gpu_layers": 50
          }

@stub.function(image=image, gpu="any")
def detect_device():
    import torch
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")

@stub.function(image=image, gpu="any")
def ingest_questions():
    print("Starting the ingestion of questions.")

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
    
@stub.function(image=image, gpu="any")
def is_philosophy_related(text):
    from sentence_transformers import SentenceTransformer, util

    print("Checking if the text is philosophy-related.")
    model_st = SentenceTransformer(
    'sentence-transformers/all-MiniLM-L6-v2', device=detect_device.remote())
    philosophical_embeddings = model_st.encode(ingest_questions.remote())

    text_embedding = model_st.encode(text)
    similarities = [util.pytorch_cos_sim(
        text_embedding, ref_emb).item() for ref_emb in philosophical_embeddings]
    return max(similarities) > 0.3



@stub.local_entrypoint()
def main():
    print("Device:", detect_device.remote())
    create_vector_db.remote()
    print(is_philosophy_related.remote("test"))
    