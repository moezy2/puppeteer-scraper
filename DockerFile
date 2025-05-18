# Use official Node.js 18 image with Playwright dependencies pre-installed
FROM mcr.microsoft.com/playwright:focal

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 10000

# Start the app
CMD ["node", "scrape.js"]
