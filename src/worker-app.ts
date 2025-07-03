import { Hono } from "hono";

const workerApp = new Hono();

// Root route showing Cloudflare Workers runtime info
workerApp.get("/", (c) => {
  const runtimeInfo = {
    runtime: "Cloudflare Workers",
    environment: "V8 Isolate",
    location: c.req.raw.cf?.colo || "Unknown",
    country: c.req.raw.cf?.country || "Unknown",
    city: c.req.raw.cf?.city || "Unknown",
    message: "Hello from Cloudflare Workers!",
    timestamp: new Date().toISOString(),
    userAgent: c.req.header("user-agent") || "Unknown",
    workersFeatures: [
      "Instant cold starts",
      "Global edge network",
      "V8 isolates",
      "Web standards APIs",
      "Durable Objects",
      "KV storage",
    ],
  };

  return c.json(runtimeInfo);
});

// Workers-specific info endpoint
workerApp.get("/info", (c) => {
  const cf = c.req.raw.cf;
  return c.json({
    runtime: "Cloudflare Workers",
    environment: "V8 Isolate (not Node.js)",
    location: {
      colo: cf?.colo,
      country: cf?.country,
      city: cf?.city,
      continent: cf?.continent,
      timezone: cf?.timezone,
      region: cf?.region,
    },
    request: {
      asn: cf?.asn,
      asOrganization: cf?.asOrganization,
      httpProtocol: cf?.httpProtocol,
      tlsVersion: cf?.tlsVersion,
      tlsCipher: cf?.tlsCipher,
    },
    apis: [
      "Fetch API",
      "Web Crypto API",
      "Cache API",
      "URL API",
      "Streams API",
      "WebAssembly",
    ],
  });
});

// Performance test endpoint
workerApp.get("/performance", async (c) => {
  const start = performance.now();

  // Simulate some work
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }

  const end = performance.now();
  const duration = end - start;

  return c.json({
    runtime: "Cloudflare Workers",
    operation: "Sum 1M integers",
    result: sum,
    duration: `${duration.toFixed(2)}ms`,
    coldStart: "Instant (Workers advantage)",
    location: c.req.raw.cf?.colo || "Unknown",
  });
});

// Health check endpoint
workerApp.get("/health", (c) => {
  return c.json({
    status: "healthy",
    runtime: "Cloudflare Workers",
    environment: "V8 Isolate",
    location: c.req.raw.cf?.colo || "Unknown",
    coldStart: "Instant",
  });
});

export default workerApp;
