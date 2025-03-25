#!/bin/bash
echo "Starting in production mode..."

if [ -z "$PRODUCTION_DATABASE_URL" ]; then
    echo "Error: PRODUCTION_DATABASE_URL is not set"
    exit 1
fi

DB_URL="$PRODUCTION_DATABASE_URL"
echo "Using database URL: $DB_URL"

# Очікування підключення до бази
until PGPASSWORD="$(echo $PRODUCTION_DATABASE_URL | cut -d: -f3 | cut -d@ -f1)" \
      psql -h "$(echo $PRODUCTION_DATABASE_URL | cut -d@ -f2 | cut -d/ -f1)" \
      -p "5432" -U "$(echo $PRODUCTION_DATABASE_URL | cut -d/ -f3 | cut -d: -f1)" \
      -d "postgres" -c "\q" >/dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - starting application"
exec node_modules/.bin/keystone start
