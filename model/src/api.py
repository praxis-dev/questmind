import logging

from fastapi import FastAPI
from .model import get_response
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO,
                    format='[%(asctime)s] %(levelname)s: %(message)s')


class Question(BaseModel):
    question: str


app = FastAPI()


@app.post("/respond/")
def get_wisdom(question_data: Question):
    response = get_response(question_data.question)
    return {"response": response}
