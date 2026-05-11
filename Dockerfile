FROM docker.m.daocloud.io/library/node:20-alpine AS base

# --- deps stage ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# --- build stage ---
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npx prisma db push
RUN npx tsx prisma/seed.ts
RUN npm run build

# --- production stage ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma

# copy pre-built database
COPY --from=build /app/prisma/dev.db ./prisma/dev.db

# standalone output (includes compiled prisma client)
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p public/uploads && chown -R nextjs:nodejs prisma public/uploads

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
