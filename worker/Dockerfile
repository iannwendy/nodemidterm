# Worker Dockerfile - Handles async tasks from Redis queue
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=nodejs:nodejs . .

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "src/worker.js"]
