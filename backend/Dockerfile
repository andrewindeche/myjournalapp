FROM python:3.10.12-slim

RUN pip install pipenv

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/backend

COPY Pipfile Pipfile.lock ./

RUN pipenv install --system

COPY . .

EXPOSE 8000

CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
