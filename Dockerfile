# Build stage
FROM node:lts-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:lts-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist/pms-admin-frontend ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
