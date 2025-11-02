#!/usr/bin/env bash
set -e

host="db"
port="5432"

# wait for Postgres
until nc -z $host $port; do
  echo "Waiting for Postgres at $host:$port..."
  sleep 1
done

# collect .env into environment if using python-dotenv (settings handles it)
python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:8000
