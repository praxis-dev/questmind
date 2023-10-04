#!/bin/sh

python src/ingest.py
uvicorn src.api:app --host 0.0.0.0 --port 80
