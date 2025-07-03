import express from 'express';
import os from 'os';
import process from 'process';

const expressApp = express();

// Middleware for JSON responses
expressApp.use(express.json());

// Get runtime information from environment variables
const runtime = process.env.RUNTIME || 'node';
const message = process.env.MESSAGE || 'Hello from Node.js container!';

// Root route showing Node.js runtime info
expressApp.get('/', (req, res) => {
  const runtimeInfo = {
    framework: 'Express',
    runtime: 'Node.js',
    version: process.version,
    platform: os.platform(),
    arch: os.arch(),
    message: message,
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime()}s`,
    memoryUsage: process.memoryUsage(),
    userAgent: req.get('User-Agent') || 'Unknown',
    nodeFeatures: [
      'CommonJS/ES Modules',
      'NPM ecosystem',
      'V8 JavaScript engine',
      'Libuv event loop',
      'Native addons support'
    ],
    expressFeatures: [
      'Middleware system',
      'Robust routing',
      'Template engines',
      'Static file serving',
      'Error handling'
    ]
  };
  
  res.json(runtimeInfo);
});

// Node.js specific endpoint
expressApp.get('/info', (req, res) => {
  res.json({
    framework: 'Express',
    runtime: 'Node.js',
    versions: process.versions,
    execPath: process.execPath,
    execArgv: process.execArgv,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      npm_config_user_agent: process.env.npm_config_user_agent
    },
    features: process.features,
    expressVersion: express.version || 'Unknown'
  });
});

// Performance test endpoint
expressApp.get('/performance', (req, res) => {
  const start = process.hrtime.bigint();
  
  // Simulate some work
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
  res.json({
    framework: 'Express',
    runtime: 'Node.js',
    operation: 'Sum 1M integers',
    result: sum,
    duration: `${duration.toFixed(2)}ms`,
    hrtime: process.hrtime()
  });
});

// Middleware demonstration endpoint
expressApp.get('/middleware', (req, res) => {
  // Add custom headers via middleware
  res.setHeader('X-Framework', 'Express');
  res.setHeader('X-Runtime', 'Node.js');
  
  res.json({
    framework: 'Express',
    runtime: 'Node.js',
    message: 'This demonstrates Express middleware capabilities',
    requestInfo: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query
    },
    middlewareFeatures: [
      'Request/Response modification',
      'Authentication',
      'Logging',
      'CORS handling',
      'Body parsing'
    ]
  });
});

// Health check endpoint
expressApp.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    framework: 'Express',
    runtime: 'Node.js',
    version: process.version,
    uptime: `${process.uptime()}s`,
    memoryUsage: process.memoryUsage()
  });
});

export default expressApp;