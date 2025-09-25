# Build stage
FROM node:24-slim AS build

# Set working directory
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
   git=1:2.39.* \
 && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

CMD ["npm", "start"]
