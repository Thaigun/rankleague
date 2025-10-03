FROM oven/bun:alpine
WORKDIR /dev-data
COPY package.json bun.lockb ./
RUN bun install
COPY database ./database
COPY tsconfig.json ./
CMD ["bun", "run", "seed"]
