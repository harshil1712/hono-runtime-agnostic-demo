FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY container_src/node/package.json ./
RUN npm install

# Copy application code
COPY container_src/node/app.js ./

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]