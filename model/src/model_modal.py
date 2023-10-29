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
    local_path="/home/i/code/seneca/project/model/data/texts/combined_corpus.txt", remote_path="/app/data/texts/combined_corpus.txt")


stub = modal.Stub("model_modal")
data_volume = modal.NetworkFileSystem.persisted("data_volume")
db_faiss_volume = modal.NetworkFileSystem.persisted("db_faiss_volume")
questions_volume = modal.NetworkFileSystem.persisted("questions_volume")
philosophical_embeddings_volume = modal.NetworkFileSystem.persisted(
    "philosophical_embeddings_volume")

DATA_PATH = "/app/data/texts"
DB_FAISS_PATH = "/app/vectorstores/db_faiss"
QUESTIONS_PATH = '/app/data/questions/questions.txt'
PHILOSOPHICAL_EMBEDDINGS_PATH = '/app/vectorstores'


@stub.function(image=image, gpu="T4", network_file_systems={DB_FAISS_PATH: db_faiss_volume}, allow_cross_region_volumes=True, secret=modal.Secret.from_name("QM_key"))
def create_vector_db():
    from langchain.embeddings.openai import OpenAIEmbeddings
    from langchain.document_loaders import DirectoryLoader, TextLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.vectorstores import FAISS
    import os

    print("Starting the creation of vector database.")

    loader = DirectoryLoader(DATA_PATH, glob="*.txt", loader_cls=TextLoader)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=25)
    texts = text_splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings()

    db = FAISS.from_documents(texts, embeddings)
    db.save_local(DB_FAISS_PATH)

    print(os.listdir(DB_FAISS_PATH))

    print("DB saved")


class RequestModel(BaseModel):
    query: str


@stub.function(image=image, network_file_systems={DB_FAISS_PATH: db_faiss_volume}, allow_cross_region_volumes=True, secret=modal.Secret.from_name("QM_key"))
@web_endpoint(method="POST")
def get_response(request: RequestModel) -> str:

    from langchain.llms import OpenAI
    from langchain.embeddings.openai import OpenAIEmbeddings
    from langchain.prompts import PromptTemplate
    from langchain.chains import RetrievalQA
    from langchain.prompts import PromptTemplate
    from langchain.vectorstores import FAISS
    from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

    query = request.query

    callbacks = [StreamingStdOutCallbackHandler()]

    embeddings = OpenAIEmbeddings()

    db = FAISS.load_local(DB_FAISS_PATH, embeddings)

    prompt_template = """
    
    You are a philosopher. Use your wisdom to help the person who is asking for your advice. This is a chat, not a mail, so conclude your messages like they are chat messages, not letters. You take delight in expressing your thoughts with beautiful and well-composed statements. You start with an analysis of the problem, and after that, you provide guidance for the person who asks you. Your responses shouldn't be too concise. You strive to provide a full response. In your responses, you call the person who asks you for advice only "my friend" without calling him Lucilius or any other name. Your response consists of three to four paragraphs of comprehensive philosophical advice.

    {context}

    Question: {question}
    Useful answer of Seneca without citing or making up quotes from other philosophers:
    """
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    chain_type_kwargs = {"prompt": PROMPT}

    llm = OpenAI(temperature=0.9, max_tokens=512,
                 callbacks=callbacks, streaming=True)

    qa = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=db.as_retriever(), chain_type_kwargs=chain_type_kwargs)

    response = qa.run(query)
    return response


@stub.local_entrypoint()
def main():
    create_vector_db.remote()
