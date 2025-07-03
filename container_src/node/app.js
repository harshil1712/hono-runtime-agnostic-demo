import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import os from 'os';
import process from 'process';

const app = new Hono();

// Get runtime information from environment variables
const runtime = process.env.RUNTIME || 'node';
const message = process.env.MESSAGE || 'Hello from Node.js container!';

// Root route showing Node.js runtime info
app.get('/', (c) => {
  const runtimeInfo = {
    runtime: runtime,
    version: process.version,
    platform: os.platform(),
    arch: os.arch(),
    message: message,
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime()}s`,
    memoryUsage: process.memoryUsage(),
    userAgent: c.req.header('user-agent') || 'Unknown',
    nodeFeatures: [
      'CommonJS/ES Modules',
      'NPM ecosystem',
      'V8 JavaScript engine',
      'Libuv event loop',
      'Native addons support'
    ]
  };

  return c.json(runtimeInfo);
});

// Node.js specific endpoint
app.get('/info', (c) => {
  return c.json({
    versions: process.versions,
    execPath: process.execPath,
    execArgv: process.execArgv,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      npm_config_user_agent: process.env.npm_config_user_agent
    },
    features: process.features
  });
});

// Performance test endpoint
app.get('/performance', async (c) => {
  const start = process.hrtime.bigint();

  // Simulate some work
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }

  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds

  return c.json({
    runtime: 'Node.js',
    operation: 'Sum 1M integers',
    result: sum,
    duration: `${duration.toFixed(2)}ms`,
    hrtime: process.hrtime()
  });
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    runtime: 'Node.js',
    version: process.version,
    uptime: `${process.uptime()}s`,
    memoryUsage: process.memoryUsage()
  });
});

const port = parseInt(process.env.PORT || '8080');

console.log(`Starting Node.js Hono server on port ${port}`);
serve({
  fetch: app.fetch,
  port: port
});