from langchain import PromptTemplate
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import CTransformers
from langchain.chains import RetrievalQA
import chainlit as clreturn_type_kwargs

DB_FAISS_PATH = "vectorstores/db_faiss"

custom_prompt_template = """
Assume you are philosopher Seneca. Use your stoic wisdom to help people the time of strife.  
Context: {context}
Question: {question}

Provide complete answer without abrupt endings. 
Your answer:
"""


def set_custom_prompt():

    prompt = PromptTemplate(template=custom_prompt_template, input_variables=[
                            'context', 'question'])

    return prompt


def load_llm():
    llm = CTransformers(
        model="llama-2-7b-chat.ggmlv3.q8_0.bin",
        model_type="llama",
        max_new_tokens=512,
        temperature=0.9
    )
    return llm


def retrieval_qa_chain(llm, prompt, db):
    qa_chain = RetrievalQA.from_chain_type(llm=llm,
                                           chain_type='stuff',
                                           retriever=db.as_retriever(
                                               search_kwargs={'k': 2}),
                                           return_source_documents=False,
                                           chain_type_kwargs={'prompt': prompt}
                                           )
    return qa_chain


def qa_bot():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': "cpu"})

    db = FAISS.load_local(DB_FAISS_PATH, embeddings)
    llm = load_llm()
    qa_prompt = set_custom_prompt()
    qa = retrieval_qa_chain(llm, qa_prompt, db)

    return qa


query = "How should I think about death?"


def final_result(query):
    qa_result = qa_bot()
    response = qa_result({"query": query})
    return response


print(final_result(query=query))
