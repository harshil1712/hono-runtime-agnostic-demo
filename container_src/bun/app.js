import { Hono } from 'hono';

const app = new Hono();

// Get runtime information from environment variables
const runtime = process.env.RUNTIME || 'bun';
const message = process.env.MESSAGE || 'Hello from Bun container!';

// Root route showing Bun runtime info
app.get('/', (c) => {
  const runtimeInfo = {
    runtime: runtime,
    version: process.versions.bun || 'unknown',
    platform: process.platform,
    arch: process.arch,
    message: message,
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime()}s`,
    memoryUsage: process.memoryUsage(),
    userAgent: c.req.header('user-agent') || 'Unknown',
    bunFeatures: [
      'Fast startup time',
      'Built-in bundler',
      'TypeScript support',
      'Web APIs',
      'JavaScriptCore engine',
      'Package manager'
    ]
  };

  return c.json(runtimeInfo);
});

// Bun specific endpoint
app.get('/info', (c) => {
  const bunInfo = {
    versions: process.versions,
    isBun: typeof Bun !== 'undefined',
    bunVersion: typeof Bun !== 'undefined' ? Bun.version : 'N/A',
    revision: typeof Bun !== 'undefined' ? Bun.revision : 'N/A',
    env: {
      BUN_ENV: process.env.BUN_ENV,
      NODE_ENV: process.env.NODE_ENV
    }
  };

  // Add Bun-specific APIs if available
  if (typeof Bun !== 'undefined') {
    bunInfo.bunAPIs = [
      'Bun.serve',
      'Bun.file',
      'Bun.write',
      'Bun.build',
      'Bun.spawn'
    ];
  }

  return c.json(bunInfo);
});

// Performance test endpoint
app.get('/performance', async (c) => {
  const start = performance.now();

  // Simulate some work
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }

  const end = performance.now();
  const duration = end - start;

  return c.json({
    runtime: 'Bun',
    operation: 'Sum 1M integers',
    result: sum,
    duration: `${duration.toFixed(2)}ms`,
    startupTime: 'Fast (Bun specialty)'
  });
});

// File operations endpoint (Bun specialty)
app.get('/file-ops', async (c) => {
  if (typeof Bun !== 'undefined') {
    try {
      // Create a temporary file
      const tempData = 'Hello from Bun file operations!';
      await Bun.write('/tmp/bun-test.txt', tempData);

      // Read it back
      const file = Bun.file('/tmp/bun-test.txt');
      const content = await file.text();

      return c.json({
        runtime: 'Bun',
        operation: 'File write/read',
        written: tempData,
        read: content,
        fileSize: file.size,
        success: true
      });
    } catch (error) {
      return c.json({
        runtime: 'Bun',
        operation: 'File write/read',
        error: error.message,
        success: false
      });
    }
  } else {
    return c.json({
      runtime: 'Bun',
      error: 'Bun APIs not available',
      success: false
    });
  }
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    runtime: 'Bun',
    version: process.versions.bun || 'unknown',
    uptime: `${process.uptime()}s`,
    memoryUsage: process.memoryUsage()
  });
});

const port = parseInt(process.env.PORT || '8080');

console.log(`Starting Bun Hono server on port ${port}`);

export default {
  port: port,
  fetch: app.fetch
};