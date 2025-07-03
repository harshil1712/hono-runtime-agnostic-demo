FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
RUN npm install

# Copy application code
COPY app.js ./

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]