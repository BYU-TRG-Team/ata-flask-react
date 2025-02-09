FROM 767397767501.dkr.ecr.us-east-1.amazonaws.com/ata-db-api:latest as flask
FROM 767397767501.dkr.ecr.us-east-1.amazonaws.com/ata-db-frontend:latest as frontend

FROM nginx

WORKDIR /app

COPY --from=flask /app /app

COPY --from=frontend /etc/ssl/certs/selfsigned.crt /etc/ssl/certs/selfsigned.crt
COPY --from=frontend /etc/ssl/private/selfsigned.key /etc/ssl/private/selfsigned.key

COPY --from=frontend /etc/nginx/conf.d/default-ssl.conf /etc/nginx/conf.d/default-ssl.conf
COPY --from=frontend /usr/share/nginx/html /usr/share/nginx/html

EXPOSE 80 443

CMD nginx -g 'daemon off;' && flask run --host="0.0.0.0" --port=5000