# Productie-image voor delplanche.cloud (TanStack Start / Vite / Node.js 22).
# Platformonafhankelijk: geen Vercel- of Cloudflare-specifieke stappen.

# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app

ENV CI=1
COPY package.json bun.lock* package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run verify && npm run build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Niet als root draaien.
RUN addgroup -g 10001 app && adduser -S -u 10001 -G app app

COPY --from=build --chown=app:app /app/.output ./.output
COPY --from=build --chown=app:app /app/public ./public

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/public/health').then(r=>process.exit(r.status===200?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
