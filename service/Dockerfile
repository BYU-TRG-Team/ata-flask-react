FROM python:3.9-alpine AS build

# RUN apk add openssl
# # Generate a self-signed certificate
# RUN mkdir -p /etc/ssl/certs /etc/ssl/private && \
#     openssl genrsa -out /etc/ssl/private/selfsigned.key 2048 && \
#     openssl req -new -x509 -key /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt -days 365 -subj "/CN=localhost"

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY instance/config.py /instance/config.py

COPY . .

RUN mkdir -p logs

ENV AWS_DEFAULT_REGION=us-east-1
ENV FLASK_APP=__init__.py

# Run Flask with HTTPS
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]