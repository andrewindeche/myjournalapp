FROM python:3.10.12

# Install pipenv
RUN pip install pipenv

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app/backend

# Copy Pipfiles for dependency installation
COPY Pipfile Pipfile.lock /app/backend/

# Install dependencies using pipenv
RUN pipenv install --deploy --system

# Copy the rest of the application code
COPY . /app/backend

# Copy the Django project files
COPY . .

# Expose port
EXPOSE 8000

# Run the server
CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]