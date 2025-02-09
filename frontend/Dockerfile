FROM node:22-alpine AS build

WORKDIR /app

COPY . .

RUN npm i 
RUN npx vite build


FROM nginx:alpine

# Remove the default Nginx HTML directory
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

ENV AWS_DEFAULT_REGION=us-east-1

CMD ["nginx", "-g", "daemon off;"]