# Using official Node.js image as base
FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Install development dependencies (needed for build step)
RUN npm install --only=dev

# Build TypeScript code (if needed)
RUN npm run build

# Expose port (change it if your server listens on a different port)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/server.js"]
