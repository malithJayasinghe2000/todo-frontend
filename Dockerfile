FROM node:alpine3.18 as build

# declare build time env variables
ARG VITE_BACKEND_URL

# Set environment variables
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build App
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT [ "nginx","-g","daemon off;" ]