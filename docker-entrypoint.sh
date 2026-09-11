#!/bin/sh
set -e

echo "=== FMS Production Container Initializing ==="

# Wait for DB connection and run migrations
if [ -n "$DATABASE_URL" ]; then
  echo "--> Checking database connection and deploying migrations..."
  npx prisma migrate deploy || {
    echo "Warning: Initial migration attempt failed, waiting 5 seconds..."
    sleep 5
    npx prisma migrate deploy
  }
fi

echo "--> Launching Next.js Production Server on port ${PORT:-3010}..."
exec "$@"