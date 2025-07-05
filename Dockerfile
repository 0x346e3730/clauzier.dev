FROM caddy:builder AS caddy-builder
RUN xcaddy build --with github.com/caddyserver/xcaddy/caddyhttp/encode/br

FROM oven/bun:latest as astro-builder
WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

FROM caddy:alpine
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY --from=astro-builder /app/public /usr/share/caddy
EXPOSE 80
