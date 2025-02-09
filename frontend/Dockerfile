FROM node:22-alpine AS build

WORKDIR /app

COPY . .

RUN npm i 
RUN npx vite build

FROM nginx:alpine

RUN apk add openssl
# Generate a self-signed certificate
RUN mkdir -p /etc/ssl/certs /etc/ssl/private
RUN openssl genrsa -out /etc/ssl/private/selfsigned.key 2048
RUN openssl req -new -x509 -key /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt -days 365 -subj "/CN=localhost"

# Remove the default Nginx HTML directory
RUN rm -rf /usr/share/nginx/html/*

COPY nginx-ssl.conf /etc/nginx/conf.d/default-ssl.conf
COPY --from=build /app/dist /usr/share/nginx/html

ENV AWS_DEFAULT_REGION=us-east-1
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]