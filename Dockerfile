FROM python:3.8-slim

WORKDIR /app

COPY src/ ./src/
COPY data/ ./data/
COPY vectorstores/ ./vectorstores/
COPY requirements.txt .
COPY entrypoint.sh /entrypoint.sh

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 80

# CMD ["python", "src/ingest.py"]

ENTRYPOINT ["/entrypoint.sh"]
