FROM oven/bun:alpine AS builder
WORKDIR /league
COPY package.json bun.lockb ./
RUN bun install
COPY database ./database
COPY src ./src
COPY tsconfig.json vite.config.ts ./
COPY server.ts ./
RUN bun run build

FROM oven/bun:alpine
WORKDIR /league
COPY --from=builder /league/package.json ./
COPY --from=builder /league/bun.lockb ./
COPY --from=builder /league/node_modules ./node_modules
COPY --from=builder /league/dist ./dist
COPY --from=builder /league/server.ts ./
EXPOSE 3000
CMD ["bun", "run", "serve"]
