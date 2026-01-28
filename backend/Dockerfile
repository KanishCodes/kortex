FROM oven/bun:1
WORKDIR /app
COPY package.json ./
COPY bun.lock* ./
RUN bun install --production
COPY . .
EXPOSE 4000
CMD ["bun", "src/index.ts"]
