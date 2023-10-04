#!/bin/sh

# Run the ingest.py script
python src/ingest.py

# Execute a long-lived command
tail -f /dev/null
