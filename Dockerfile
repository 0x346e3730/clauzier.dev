FROM oven/bun:latest
WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD bun ./dist/server/entry.mjs
