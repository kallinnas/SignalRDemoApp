# Stage 1: Build the Angular app
FROM node:18 AS build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the Angular app with a simple web server (nginx)
FROM nginx:alpine
COPY --from=build-stage /app/dist/signalr-demo /usr/share/nginx/html

# Expose the default port
EXPOSE 80
