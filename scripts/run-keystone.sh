#!/bin/bash

echo "Starting in production mode..."

# Check database connection
echo "Using database URL: $DATABASE_URL"
until PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') psql -h $(echo $DATABASE_URL | sed -n 's/.*@\([^/]*\)\/.*/\1/p') -U $(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p') -d $(echo $DATABASE_URL | sed -n 's/.*\/\(.*\)?.*/\1/p') -c '\q'; do
  echo "Waiting for database to be ready..."
  sleep 1
done
echo "Database is up - starting application"

# Start the application
node_modules/.bin/keystone start 