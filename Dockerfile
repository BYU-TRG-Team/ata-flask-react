FROM 767397767501.dkr.ecr.us-east-1.amazonaws.com/ata-db-api:latest as flask
FROM 767397767501.dkr.ecr.us-east-1.amazonaws.com/ata-db-frontend:latest as frontend

FROM nginx:alpine

WORKDIR /app

COPY --from=flask /app /app
COPY --from=frontend /etc/nginx/conf.d/default-ssl.conf /etc/nginx/conf.d/default-ssl.conf

EXPOSE 80 443

CMD nginx -g 'daemon off;' && flask run --host="0.0.0.0" --port=5000