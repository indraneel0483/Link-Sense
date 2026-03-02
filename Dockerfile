# Use official Playwright image with Chromium pre-installed
FROM mcr.microsoft.com/playwright:v1.58.2-noble

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/server.js"]
