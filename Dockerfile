FROM oven/bun:latest as builder
WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

FROM caddy:alpine
COPY --from=builder /app/dist /usr/share/caddy
COPY --from=builder /app/public /usr/share/caddy
EXPOSE 80
