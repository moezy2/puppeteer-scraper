# Use the correct Playwright 1.52.0 image
FROM mcr.microsoft.com/playwright:1.52.0-jammy

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the app files
COPY . .

# Expose port if needed
EXPOSE 10000

# Start the script
CMD ["node", "scrape.js"]
