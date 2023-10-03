from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain import PromptTemplate
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import CTransformers
from langchain.chains import RetrievalQA
import chainlit as cl
from sentence_transformers import SentenceTransformer, util
from ingest import ingest_questions

questions = ingest_questions()

DB_FAISS_PATH = 'vectorstores/db_faiss'

model_st = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
philosophical_embeddings = model_st.encode(questions)


def is_philosophy_related(text):
    text_embedding = model_st.encode(text)
    similarities = [util.pytorch_cos_sim(
        text_embedding, ref_emb).item() for ref_emb in philosophical_embeddings]
    return max(similarities) > 0.5


custom_prompt_template = """You are philosopher Seneca. Use your wisdom to help the one who is asking for your advice. You answer in his literary style. In your responses, you call the person who asks you for advice only "my friend".

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
          "temperature": 0.7, "context_length": 1024}


def load_llm():
    llm = CTransformers(
        model="./llama-2-13b-chat.Q4_K_M.gguf",
        model_type="llama",
        config=config
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


query = "What if I'm tired of living?"

tokenized_query = model_st.tokenizer.tokenize(query)
token_count = len(tokenized_query)
print("Tokenized Query:", tokenized_query)
print("Query Token Count:", token_count)

if token_count > MAX_QUERY_TOKENS:
    print("Your question should be shorter in terms of token count.")
else:
    def postprocessing(text):
        if text.endswith('.'):
            return text
        elif '.' in text:
            last_dot_position = text.rfind('.')
            return text[:last_dot_position + 1]
        else:
            return text

    def final_result(query):
        if not is_philosophy_related(query):
            return "I don't know this"
        qa_result = qa_bot()
        response_dict = qa_result({'query': query})

        response_text = response_dict.get('result', '')

        tokenized_response = model_st.tokenizer.tokenize(response_text)
        response_token_count = len(tokenized_response)

        print("Tokenized Response:", tokenized_response)
        print("Response Token Count:", response_token_count)

        refined_response = postprocessing(response_text)
        return refined_response

    print(final_result(query=query))
