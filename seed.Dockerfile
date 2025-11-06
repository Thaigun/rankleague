FROM oven/bun:alpine
WORKDIR /dev-data
COPY package.json bun.lockb ./
RUN bun install
COPY database ./database
COPY src ./src
COPY tsconfig.json ./
CMD ["bun", "run", "seed"]
