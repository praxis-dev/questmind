from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain import PromptTemplate
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import CTransformers
from langchain.chains import RetrievalQA
import chainlit as cl
from sentence_transformers import SentenceTransformer, util

DB_FAISS_PATH = 'vectorstores/db_faiss'

philosophical_questions = [
    "What is the meaning of life?",
    "Is there a purpose to existence?",
    "What is reality?",
    "Do we have free will?",
    "What is consciousness?",
    "What is truth?",
    "What is good and evil?",
    "What is the nature of time?",
    "What is love?",
    "What is suffering?",
    "How should we live our lives?",
    "What is the nature of being?",
    "Is there life after death?",
    "What is knowledge?",
    "Why is there something rather than nothing?"
]


model_st = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
philosophical_embeddings = model_st.encode(philosophical_questions)


def is_philosophy_related(text):
    text_embedding = model_st.encode(text)
    similarities = [util.pytorch_cos_sim(
        text_embedding, ref_emb).item() for ref_emb in philosophical_embeddings]
    return max(similarities) > 0.75


custom_prompt_template = """You are philosopher Seneca. Use your wisdom to help the one who is asking for your advice.

Context: {context}
Question: {question}

Useful answer of Seneca:
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


def load_llm():
    llm = CTransformers(
        model="TheBloke/Llama-2-7B-Chat-GGML",
        model_type="llama",
        max_new_tokens=1024,
        temperature=0.5
    )
    return llm


def qa_bot():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': 'cpu'})
    db = FAISS.load_local(DB_FAISS_PATH, embeddings)
    llm = load_llm()
    qa_prompt = set_custom_prompt()
    qa = retrieval_qa_chain(llm, qa_prompt, db)
    return qa


query = "what is consciousness?"


def final_result(query):
    if not is_philosophy_related(query):
        return "I don't know this"
    qa_result = qa_bot()
    response = qa_result({'query': query})
    return response


print(final_result(query=query))
