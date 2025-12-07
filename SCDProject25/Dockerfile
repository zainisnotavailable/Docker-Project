# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Create backups directory
RUN mkdir -p /app/backups

# Set environment to production
ENV NODE_ENV=production

# Expose port (if needed for future HTTP API)
EXPOSE 3000

# Command to run the application
CMD ["node", "main.js"]
