FROM oven/bun:1.1-alpine

WORKDIR /app

# Copy package files
COPY container_src/bun/package.json ./
RUN bun install

# Copy application code
COPY container_src/bun/app.js ./

# Expose port
EXPOSE 8080

# Start the application
CMD ["bun", "run", "app.js"]