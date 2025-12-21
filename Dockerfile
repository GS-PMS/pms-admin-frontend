# Build stage
FROM node:lts-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Production stage - NGINX
FROM nginx:alpine
COPY --from=build /app/dist/pms-admin-frontend/browser /usr/share/nginx/html
EXPOSE 80
