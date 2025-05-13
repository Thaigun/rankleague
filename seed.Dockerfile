FROM oven/bun:alpine
WORKDIR /dev-data
COPY package.json bun.lockb ./
RUN bun install
COPY src ./src
COPY tsconfig.json ./
CMD ["bun", "run", "seed"]
