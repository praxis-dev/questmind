from fastapi.responses import StreamingResponse
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
    local_path="/home/i/code/seneca/project/model/data/texts/JTE.txt", remote_path="/app/data/texts/JTE.txt").copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/texts/meditations.txt", remote_path="/app/data/texts/meditations.txt").copy_local_file(
    local_path="/home/i/code/seneca/project/model/data/texts/enchiridion.txt", remote_path="/app/data/texts/enchiridion.txt")


stub = modal.Stub("model_modal_stream")
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
@web_endpoint(label="model-endpoint-2", method="POST")
def get_response(request: RequestModel) -> StreamingResponse:

    from langchain.llms import OpenAI
    from langchain.embeddings.openai import OpenAIEmbeddings
    from langchain.prompts import PromptTemplate
    from langchain.chains import RetrievalQA
    from langchain.prompts import PromptTemplate
    from langchain.vectorstores import FAISS
    from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
    from queue import Queue, Empty
    from threading import Thread
    import json
    from langchain.callbacks.base import BaseCallbackHandler
    from typing import Any

    def count_tokens(text):
        import tiktoken
        encoding = tiktoken.encoding_for_model("gpt-3.5-turbo-instruct")
        num_tokens = len(encoding.encode(text))
        return num_tokens

    def trim_query(query, excess_token_estimate):
        print("Excess tokens to be trimmed:", excess_token_estimate)
        current_token_count = count_tokens(query)
        print("Current token count:", current_token_count)

        avg_chars_per_token = len(
            query) / current_token_count if current_token_count else 0
        estimated_chars_to_remove = int(
            excess_token_estimate * avg_chars_per_token)

        trimmed_query = query[:-estimated_chars_to_remove]
        trimmed_token_count = count_tokens(trimmed_query)

        while trimmed_token_count > (current_token_count - excess_token_estimate) and len(trimmed_query) > 0:
            trimmed_query = trimmed_query[:-6]
            trimmed_token_count -= 1

        print("Trimmed query length:", len(trimmed_query))
        return trimmed_query

    prompt_template = """

        You are a psychological advisor and coach. If the query is offensive or trollish in nature, handle it with wit and poise and offer to focus on productive conversation. For sincere inquiries, utilize your knowledge to provide both theoretical insights and actionable guidance. This is a chat; conclude messages in a way that is informal yet respectful. Your message should be formatted as a chat message without farewells at the end. Aim for the highest standards in grammar, spelling, and punctuation. 

        Start by analyzing the problem presented. Ask the user any question if you need to understand the situation thoroughly. You don't have to fill the entire token limit. Be concise when investigating the issue and asking quiestions and eloquent when you are ready to make a conclusion. Instead of providing direct advice, strive to ask question that will prompt the client to start the process of self-reflection and come to the right conclusions themselves, where possible.  When you don't know the answer, you just say so without making up the response. You don't send the user to a therapist, psychologist, counselor, or coach; you are the psychologist, counselor, or coach. You are the therapist, psychologist, counselor, and coach, and you are here to help. You don't start your response with "ai:" and you don't end it with "Sincerely, [your name]".
        

        {context}

        Question: {question}
        Useful answer:

        """

    prompt_template_tokens = count_tokens(prompt_template)

    query = request.query

    callbacks = [StreamingStdOutCallbackHandler()]

    embeddings = OpenAIEmbeddings()

    db = FAISS.load_local(DB_FAISS_PATH, embeddings)

    retriever = db.as_retriever(search_kwargs={"k": 5})
    retrieval_results = retriever.get_relevant_documents(query)
    retrieved_content = " ".join(
        [doc.page_content for doc in retrieval_results])

    total_token_limit = 4096
    allocated_for_output = 512
    prompt_template_tokens = count_tokens(prompt_template)
    retrieved_context_tokens = count_tokens(retrieved_content)
    print("retrieved context tokens", retrieved_context_tokens)
    query_tokens = count_tokens(query)

    print("query_tokens", query_tokens)

    total_input_tokens = prompt_template_tokens + \
        query_tokens + retrieved_context_tokens

    max_input_tokens = total_token_limit - allocated_for_output
    excess_tokens = total_input_tokens - max_input_tokens

    if total_input_tokens > max_input_tokens:
        query = trim_query(query, excess_tokens)

    print("total_input_tokens", total_input_tokens)
    print("max_input_tokens", max_input_tokens)

    output_queue = Queue()

    class QueueCallbackHandler(BaseCallbackHandler):
        def __init__(self, queue):
            self.queue = queue

        def on_llm_new_token(self, token: str, **kwargs) -> None:
            self.queue.put(
                {
                    "event": "message",
                    "id": "message_id",
                    "retry": 1,
                    "data": token,
                }
            )

        def on_llm_end(self, *args, **kwargs) -> Any:
            return self.queue.empty()

    def stream():
        job_done = object()

        def task():
            qa.run(query)
            output_queue.put(job_done)

        t = Thread(target=task)
        t.start()

        sentence = ''
        while True:
            try:
                item = output_queue.get(True, timeout=1)
                if item is job_done:
                    if sentence:
                        yield f"data: {json.dumps({'data': sentence})}\n\n"
                    break
                else:
                    token = item['data']
                    sentence += token
                    # Check for sentence delimiters
                    if any(token.endswith(delimiter) for delimiter in ('.', '?', '!', '\n')):
                        yield f"data: {json.dumps({'data': sentence})}\n\n"
                        sentence = ''  # Reset the sentence buffer after yielding
            except Empty:
                continue

    callbacks = [QueueCallbackHandler(output_queue)]

    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    chain_type_kwargs = {"prompt": PROMPT}

    llm = OpenAI(model_name="gpt-3.5-turbo-instruct", temperature=0.9, max_tokens=allocated_for_output,
                 callbacks=callbacks, streaming=True,)

    qa = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=retriever, chain_type_kwargs=chain_type_kwargs)

    print("trimmed_query_length", count_tokens(query))
    print(query)

    return StreamingResponse(stream(), media_type="text/event-stream")


@stub.local_entrypoint()
def main():
    create_vector_db.remote()
