# Use the Playwright 1.52.0 base image (with all browser dependencies)
FROM mcr.microsoft.com/playwright:v1.52.0-focal

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port (optional, for clarity)
EXPOSE 10000

# Start the app
CMD ["node", "scrape.js"]
