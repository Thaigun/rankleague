FROM oven/bun:alpine AS builder
WORKDIR /league
COPY package.json bun.lockb ./
RUN bun install
COPY database ./database
COPY src ./src
COPY tsconfig.json vite.config.ts ./
COPY server.ts ./
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "serve"]
