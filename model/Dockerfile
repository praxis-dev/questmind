FROM python:3.8-slim

WORKDIR /app

COPY src/ /app/src/
COPY data/ /app/data/
COPY vectorstores/ /app/vectorstores/
COPY requirements.txt /app/
COPY entrypoint.sh /app/

RUN pip install --no-cache-dir -r /app/requirements.txt

EXPOSE 80

ENTRYPOINT ["/app/entrypoint.sh"]
