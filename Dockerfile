# Build stage
FROM node:lts-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist/pms-admin-frontend ./dist

EXPOSE 4200

CMD ["serve", "-s", "dist/browser", "-l", "4200"]
