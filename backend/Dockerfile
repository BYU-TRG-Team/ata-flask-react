FROM python:3.9-alpine AS build

WORKDIR /app

COPY service/requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install gunicorn

COPY . .

RUN mkdir -p logs

ENV AWS_DEFAULT_REGION=us-east-1
ENV FLASK_APP=__init__.py

# Run Flask with HTTPS
CMD ["gunicorn", "--bind", "0.0.0.0", "--workers", "4", "wsgi:app"]