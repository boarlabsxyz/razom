#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the root directory
cd "$SCRIPT_DIR/.."

# Load environment variables from .env file
if [ -f veterans/.env ]; then
    export $(cat veterans/.env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found in veterans directory"
    exit 1
fi

# Build the Docker image using environment variables
docker build \
    --build-arg DATABASE_URL="$DATABASE_URL" \
    --build-arg DEVELOPMENT_DATABASE_URL="$DATABASE_URL" \
    --build-arg SESSION_SECRET="$SESSION_SECRET" \
    -t my-keystone \
    -f Dockerfile.keystone . 