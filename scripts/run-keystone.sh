#!/bin/bash

echo "Starting in production mode..."

DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:/?]*\).*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*@\S*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

if [ -z "$DB_PORT" ]; then
  DB_PORT=5432
fi

echo "Parsed values:"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"

until PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "Waiting for database to be ready..."
  sleep 1
done

echo "Database is up - starting application"

if [ ! -d ".keystone" ]; then
    echo "Error: Keystone build not found. Please run build-keystone.sh first."
    exit 1
fi

echo "🔧 Running Keystone in NODE_ENV=$NODE_ENV"
node_modules/.bin/keystone start 