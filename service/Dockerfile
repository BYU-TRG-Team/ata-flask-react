FROM public.ecr.aws/codebuild/amazonlinux2-x86_64-standard:4.0 AS build

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

RUN mkdir -p logs

ENV AWS_DEFAULT_REGION=us-east-1
ENV FLASK_APP=__init__.py
CMD ["flask", "run", "--host=0.0.0.0"]