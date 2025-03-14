FROM node:current-alpine3.21 AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "npm run db:seed && node dist/src/main.js"]
