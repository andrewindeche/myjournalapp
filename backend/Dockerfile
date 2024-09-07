FROM python:3.10.12

# Install pipenv
RUN pip install pipenv

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app/backend

# Copy Pipfile and Pipfile.lock first to leverage Docker cache
COPY Pipfile Pipfile.lock /app/backend/

# Install dependencies using pipenv
RUN pipenv install

# Verify that Django is installed
RUN pipenv run pip list

# Copy the rest of the project files
COPY . /app/backend/

# Expose port
EXPOSE 8000

# Run the server
CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
