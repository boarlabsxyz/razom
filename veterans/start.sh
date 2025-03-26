#!/bin/bash
# echo "Starting in production mode..."

# if [ -z "$DATABASE_URL" ]; then
#     echo "Error: DATABASE_URL is not set"
#     exit 1
# fi

# DB_URL="$DATABASE_URL"
# echo "Using database URL: $DB_URL"

# Wait for database connection
# until PGPASSWORD="$(echo $DATABASE_URL | cut -d: -f3 | cut -d@ -f1)" \
#       psql -h "$(echo $DATABASE_URL | cut -d@ -f2 | cut -d/ -f1)" \
#       -p "5432" -U "$(echo $DATABASE_URL | cut -d/ -f3 | cut -d: -f1)" \
#     #   -d "postgres" -c "\q" >/dev/null 2>&1; do
#       -d "postgres" -c "\q"; do
#   echo "Database is unavailable - sleeping"
#   sleep 2
# done

# echo "Database is up - starting application"
# exec node_modules/.bin/keystone start
