#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the veterans directory
cd "$SCRIPT_DIR/../veterans"

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found in veterans directory"
    exit 1
fi

# Build the Docker image using environment variables
docker build \
    --build-arg PRODUCTION_DATABASE_URL="$PRODUCTION_DATABASE_URL" \
    --build-arg SESSION_SECRET="$SESSION_SECRET" \
    -t my-keystone \
    -f "$SCRIPT_DIR/../Dockerfile.keystone" . 