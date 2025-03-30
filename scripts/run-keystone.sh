#!/bin/bash

echo "Starting in production mode..."

# Check database connection
# echo "Using database URL: $DATABASE_URL"
# until PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') psql -h $(echo $DATABASE_URL | sed -n 's/.*@\([^/]*\)\/.*/\1/p') -U $(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p') -d $(echo $DATABASE_URL | sed -n 's/.*\/\(.*\)?.*/\1/p') -c '\q'; do
#   echo "Waiting for database to be ready..."
#   sleep 1
# done
# echo "Database is up - starting application"

echo "Using database URL: $DATABASE_URL"

# Розбираємо DATABASE_URL на складові
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:/?]*\).*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*@\S*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Якщо порт не знайдено, встановлюємо стандартний 5432
if [ -z "$DB_PORT" ]; then
  DB_PORT=5432
fi

echo "Parsed values:"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"

# Очікуємо підключення до бази
until PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "Waiting for database to be ready..."
  sleep 1
done

echo "Database is up - starting application"
# Verify Keystone build
if [ ! -d ".keystone" ]; then
    echo "Error: Keystone build not found. Please run build-keystone.sh first."
    exit 1
fi

# Verify Admin UI build
if [ ! -d ".keystone/admin" ]; then
    echo "Error: Admin UI build not found. Please run build-keystone.sh first."
    exit 1
fi

# Start the application
echo "Starting Keystone server..."
NODE_ENV=production node_modules/.bin/keystone start 