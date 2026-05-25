#!/bin/sh
set -e
echo "Running migrations..."
node dist/config/migrations.js
echo "Starting server..."
exec node dist/server.js
