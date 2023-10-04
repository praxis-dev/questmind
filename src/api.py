from fastapi import FastAPI
from .model import get_response

app = FastAPI()


@app.post("/respond/")
def get_prediction(question: str):
    response = get_response(question)
    return {"response": response}
