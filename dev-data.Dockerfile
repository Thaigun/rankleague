FROM oven/bun:alpine
WORKDIR /dev-data
COPY . .
RUN bun install
CMD ["bun", "run", "setup-dev-data"]
