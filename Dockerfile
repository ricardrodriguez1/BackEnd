# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY api/package*.json ./
RUN npm install

# Stage 2: Production environment
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY api/package*.json ./
RUN npm install --only=production

# Copy source code
COPY api/src ./src

# Expose backend port
EXPOSE 3000

# Run the application
CMD ["node", "src/index.js"]
