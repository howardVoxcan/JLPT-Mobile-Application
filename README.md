# JLPT-Fullstack-Template

Repository template: **Django (backend) + React Native (frontend via Expo) + PostgreSQL + Docker**

Goal: separate frontend & backend as independent services, orchestrated with Docker Compose for local development.

---

## Repository layout (suggested)

```
JLPT-Fullstack-Template/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── entrypoint.sh
│   └── (Django project files e.g. manage.py, project/ app/ ...)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── (React Native / Expo project files)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## After running `django-admin startproject`

When you run this command inside the `backend` folder:

```bash
cd backend
django-admin startproject project .
```

### The resulting structure:

```
backend/
├── Dockerfile
├── requirements.txt
├── entrypoint.sh
├── manage.py
└── project/
    ├── __init__.py
    ├── asgi.py
    ├── settings.py   ← main config file
    ├── urls.py
    └── wsgi.py
```

✅ **Explanation:**

* `manage.py`: runs Django commands (`runserver`, `migrate`, etc.)
* `project/settings.py`: stores app config, database, middleware, etc.
* `project/urls.py`: defines route mapping.
* `project/wsgi.py`: entry point for production servers.

You’ll edit `settings.py` most often.

---

## After running `npx create-expo-app frontend`

Run the following to initialize the React Native frontend using Expo:

```bash
cd frontend
npx create-expo-app .
```

### The resulting structure:

```
frontend/
├── App.js                ← main entry file for React Native
├── app.json
├── babel.config.js
├── package.json
├── node_modules/
└── assets/
```

✅ **Explanation:**

* `App.js`: where you’ll write your React Native screens.
* `assets/`: stores images, icons, and other resources.
* `package.json`: defines dependencies and scripts.
* `babel.config.js`: handles modern JavaScript syntax.

You’ll run `npx expo start` or use Docker (explained below) to serve it.

---

## docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:16
    container_name: jlpt_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    container_name: jlpt_backend
    command: ["/bin/bash", "-c", "./entrypoint.sh"]
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}
      - DJANGO_DEBUG=1
    depends_on:
      - db

  frontend:
    build: ./frontend
    container_name: jlpt_frontend
    volumes:
      - ./frontend:/workspace
    ports:
      - "19000:19000"
      - "19001:19001"
      - "19002:19002"
    environment:
      - EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
    command: ["/bin/sh","-c","cd /workspace && yarn start --tunnel"]

volumes:
  postgres_data:
```

---

## backend setup

### `Dockerfile`

```dockerfile
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y build-essential libpq-dev gettext --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000
CMD ["/bin/bash", "-c", "./entrypoint.sh"]
```

### `requirements.txt`

```
Django>=4.2
djangorestframework
psycopg2-binary
dj-database-url
python-dotenv
```

### `entrypoint.sh`

```bash
#!/usr/bin/env bash
set -e

host="db"
port="5432"

until nc -z $host $port; do
  echo "Waiting for Postgres at $host:$port..."
  sleep 1
done

python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:8000
```

Run `chmod +x backend/entrypoint.sh` before building.

### `settings.py` snippet

```python
import os
import dj_database_url
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-secret')
DEBUG = os.getenv('DJANGO_DEBUG', '0') == '1'
DATABASES = {
    'default': dj_database_url.parse(os.getenv('DATABASE_URL'), conn_max_age=600)
}
```

### Creating an app & models

```bash
docker exec -it jlpt_backend bash
python manage.py startapp core
```

Then define models, run `python manage.py makemigrations && python manage.py migrate`.

---

## frontend setup

### `Dockerfile`

```dockerfile
FROM node:18
WORKDIR /workspace
RUN npm install -g expo-cli
COPY package.json yarn.lock* /workspace/
RUN yarn install
COPY . /workspace
EXPOSE 19000 19001 19002
CMD ["/bin/sh", "-c", "yarn start --tunnel"]
```

### `package.json`

```json
{
  "name": "jlpt-mobile",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "^48.0.0",
    "react": "18.2.0",
    "react-native": "0.71.0",
    "react-navigation": "^4.4.4"
  }
}
```

### Run Expo locally

If you’re not using Docker yet:

```bash
cd frontend
yarn install
npx expo start
```

Then scan the QR code via Expo Go on your phone.

---

## .env.example

```
POSTGRES_USER=app_admin
POSTGRES_PASSWORD=strongpassword123
POSTGRES_DB=app_db
DJANGO_SECRET_KEY=changeme_to_secure_key
```

---

## Bootstrapping locally

1. Install Docker Desktop.
2. Copy `.env.example` → `.env` and fill credentials.
3. Run:

```bash
docker compose up --build -d
```

4. Visit:

   * Django → [http://localhost:8000](http://localhost:8000)
   * Expo DevTools → [http://localhost:19002](http://localhost:19002)
5. To create admin:

```bash
docker exec -it jlpt_backend bash
python manage.py createsuperuser
```

6. Stop:

```bash
docker compose down
```

7. To remove all data:

```bash
docker compose down -v
```

---

## Notes & best practices

* Backend & frontend are decoupled.
* Store secrets in `.env`.
* For production, replace `runserver` with `gunicorn` or `uvicorn`.
* Expo can connect via LAN or Tunnel for real device testing.
* Use this template as a foundation for any fullstack mobile/web Django app.
