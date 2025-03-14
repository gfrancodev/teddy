FROM node:current-alpine3.21
WORKDIR /app
ENV VITE_PORT=8000
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev", "--", "--host"]