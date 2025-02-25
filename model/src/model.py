import logging

import torch

from langchain import PromptTemplate
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import CTransformers
from langchain.chains import RetrievalQA
from sentence_transformers import SentenceTransformer, util
from .ingest import ingest_questions
import os

logging.basicConfig(level=logging.INFO,
                    format='[%(asctime)s] %(levelname)s: %(message)s')

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
gpu_layers_value = 50 if device.type == "cuda" else 0


os.environ["TOKENIZERS_PARALLELISM"] = "false"

questions = ingest_questions()

DB_FAISS_PATH = '/app/vectorstores/db_faiss'

config = {'max_new_tokens': 1024 - MAX_QUERY_TOKENS, 'repetition_penalty': 1.1,
          "temperature": 0.6, "context_length": 1024, "gpu_layers": gpu_layers_value
          }

model_st = SentenceTransformer(
    'sentence-transformers/all-MiniLM-L6-v2', device=device)
philosophical_embeddings = model_st.encode(questions)


def is_philosophy_related(text):
    logging.info("Checking if the text is philosophy-related.")

    text_embedding = model_st.encode(text)
    similarities = [util.pytorch_cos_sim(
        text_embedding, ref_emb).item() for ref_emb in philosophical_embeddings]
    return max(similarities) > 0.3


custom_prompt_template = """You are philosopher Seneca. Use your wisdom to help the one who is asking for your advice. You answer in his literary style. In your responses, you call the person who asks you for advice only "my friend" without calling him Lucilius or any other name.

Context: {context}
Question: {question}

Useful answer of Seneca without citing or making up quotes from other philosophers:
"""


def set_custom_prompt():
    prompt = PromptTemplate(template=custom_prompt_template, input_variables=[
                            'context', 'question'])
    return prompt


def retrieval_qa_chain(llm, prompt, db):
    qa_chain = RetrievalQA.from_chain_type(llm=llm,
                                           chain_type='stuff',
                                           retriever=db.as_retriever(
                                               search_kwargs={'k': 2}),
                                           return_source_documents=False,
                                           chain_type_kwargs={'prompt': prompt})
    return qa_chain


MAX_QUERY_TOKENS = 35


config = {'max_new_tokens': 1024 - MAX_QUERY_TOKENS, 'repetition_penalty': 1.1,
          "temperature": 0.6, "context_length": 1024, "gpu_layers": gpu_layers_value
          }

LLM_PATH = "/app/src/llama-2-13b-chat.Q4_K_M.gguf"


def load_llm():
    logging.info("Loading the LLM model.")
    logging.info(f"gpu_layers value: {config['gpu_layers']}")

    llm = CTransformers(
        model=LLM_PATH,
        model_type="llama",
        config=config
    )

    return llm


def qa_bot():
    logging.info("Initializing the QA bot.")

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': device})
    db = FAISS.load_local(DB_FAISS_PATH, embeddings)
    llm = load_llm()
    qa_prompt = set_custom_prompt()
    qa = retrieval_qa_chain(llm, qa_prompt, db)
    return qa


def postprocessing(text):
    logging.info("Postprocessing the response.")

    if text.endswith('.'):
        return text
    elif '.' in text:
        last_dot_position = text.rfind('.')
        return text[:last_dot_position + 1]
    else:
        return text


def get_response(query: str) -> str:
    if not is_philosophy_related(query):
        return ("This is not my area of expertise.")
    qa_result = qa_bot()
    response_dict = qa_result({'query': query})

    response_text = response_dict.get('result', '')

    refined_response = postprocessing(response_text)
    return refined_response
