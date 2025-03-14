FROM node:current-alpine3.21 AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --chown=root:root --chmod=755 package.json package-lock.json ./
COPY --chown=root:root --chmod=755 .npmrc ./
COPY --chown=root:root --chmod=755 tsconfig.json tsconfig.build.json nest-cli.json ./
COPY --chown=root:root --chmod=755 src ./src

RUN npm i --ignore-scripts -g @nestjs/cli && \
    npm ci --ignore-scripts && \
    npm run build

FROM node:current-alpine3.21
WORKDIR /app

RUN apk add --no-cache libc6-compat && \
    mkdir -p /app/docs && \
    chown -R node:node /app && \
    chmod -R 755 /app

COPY --from=builder --chown=root:root --chmod=755 /app/package*.json ./
COPY --from=builder --chown=root:root --chmod=755 /app/dist ./dist
COPY --from=builder --chown=root:root --chmod=755 /app/node_modules ./node_modules

USER node
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
