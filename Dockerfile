FROM oven/bun:alpine
WORKDIR /league
COPY . .
RUN bun install
EXPOSE 3000
CMD ["bun", "run", "dev"]
