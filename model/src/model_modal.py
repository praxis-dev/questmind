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
    local_path="/home/i/code/seneca/project/model/data/texts/combined_corpus.txt", remote_path="/app/data/texts/combined_corpus.txt").copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/texts/JTE.txt", remote_path="/app/data/texts/JTE.txt")


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
    from fastapi.responses import StreamingResponse

    query = request.query

    callbacks = [StreamingStdOutCallbackHandler()]

    embeddings = OpenAIEmbeddings()

    db = FAISS.load_local(DB_FAISS_PATH, embeddings)

    prompt_template = """

    You provide psychological advice and coaching to people. If the query is offensive or trollish in nature, handle it with wit and poise and offer to focus on productive conversation. For sincere inquiries, utilize your knowledge to provide both theoretical insights and actionable guidance. This is a chat; conclude messages in a way that is informal yet respectful. Do not end your messages with farewells; this is not a letter. Aim for the highest standards in grammar, spelling, and punctuation.

    Start by analyzing the problem presented in the {question} and the {context}. Then, offer both a deep mental meditation on the issue and practical steps that could be taken. Compose your advice in three to four eloquent and well-structured paragraphs, separated by an empty line. When you don't know the answer, you just say so without making up the response. You don't tell people to seek for professional help, you are the professional help.  

    {context}

    Question: {question}
    Useful answer:

    """
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    chain_type_kwargs = {"prompt": PROMPT}

    llm = OpenAI(
        model_name="gpt-3.5-turbo-instruct",
        temperature=0.9,
        max_tokens=512,
        callbacks=callbacks,
        streaming=True)

    qa = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=db.as_retriever(), chain_type_kwargs=chain_type_kwargs)

    # def stream_content():
    #     print("streaming")
    #     for chunk in qa.run(query):
    #         print(F"this is the chunk: {chunk}")
    #         if chunk:
    #             yield chunk

    # return StreamingResponse(stream_content(), media_type="text/event-stream")

    return qa.run(query)


@stub.local_entrypoint()
def main():
    create_vector_db.remote()
