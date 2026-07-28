FROM node:20-alpine
WORKDIR /app
RUN mkdir -p /data && chown node:node /data
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
USER node
CMD ["node", "index.js"]