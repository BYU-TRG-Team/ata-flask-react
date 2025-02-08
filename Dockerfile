FROM public.ecr.aws/codebuild/amazonlinux2-x86_64-standard:4.0 AS build

FROM python:3.9-slim

WORKDIR /app

COPY service/requirements.txt requirements.txt
RUN python --version
RUN pip install -r requirements.txt

COPY . .

RUN mkdir -p logs

ENV FLASK_APP=service/__init__.py
CMD ["flask", "run", "--host=0.0.0.0"]