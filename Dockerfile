FROM node:22-bullseye-slim

# Install OpenSSL for Prisma and SQLite tools
RUN apt-get update && apt-get install -y openssl sqlite3 ca-certificates curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (production + dev for build)
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Prune dev dependencies to reduce image size
RUN npm prune --production

# Create a directory for the persistent SQLite database
RUN mkdir -p /data

# Expose the default Fly.io port
EXPOSE 3000

# Set environment variables for the database script
ENV DATABASE_URL="file:/data/sqlite.db"
ENV PORT=3000

# Start script: Push database schema (creates db if it doesn't exist) then start the server
CMD npx prisma db push --accept-data-loss && npm run start