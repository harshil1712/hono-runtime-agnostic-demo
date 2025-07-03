import { Container, getContainer } from "@cloudflare/containers";
import { Hono } from "hono";

export class NodeContainer extends Container {
  // Port the container listens on (default: 8080)
  defaultPort = 8080;
  // Time before container sleeps due to inactivity (default: 30s)
  sleepAfter = "2m";
  // Environment variables passed to the container
  envVars = {
    RUNTIME: "node",
    MESSAGE: "Running Hono on Node.js runtime!",
  };

  // Optional lifecycle hooks
  override onStart() {
    console.log("Node container successfully started");
  }

  override onStop() {
    console.log("Node container successfully shut down");
  }

  override onError(error: unknown) {
    console.log("Node container error:", error);
  }
}

export class BunContainer extends Container {
  // Port the container listens on (default: 8080)
  defaultPort = 8080;
  // Time before container sleeps due to inactivity (default: 30s)
  sleepAfter = "2m";
  // Environment variables passed to the container
  envVars = {
    RUNTIME: "bun",
    MESSAGE: "Running Hono on Bun runtime!",
  };

  // Optional lifecycle hooks
  override onStart() {
    console.log("Bun container successfully started");
  }

  override onStop() {
    console.log("Bun container successfully shut down");
  }

  override onError(error: unknown) {
    console.log("Bun container error:", error);
  }
}


// Create Hono app with proper typing for Cloudflare Workers
const app = new Hono<{
  Bindings: { 
    Node_CONTAINER: DurableObjectNamespace<NodeContainer>;
    Bun_CONTAINER: DurableObjectNamespace<BunContainer>;
  };
}>();

// Home route with available endpoints
app.get("/", (c) => {
  return c.text(
    "Hono Multi-Runtime Demo\n" +
      "Available endpoints:\n" +
      "GET /node - Run Hono on Node.js runtime\n" +
      "GET /bun - Run Hono on Bun runtime\n\n" +
      "Each endpoint demonstrates Hono running in different JavaScript runtimes!",
  );
});

// Route requests to Node.js container (including sub-paths)
app.all("/node/*", async (c) => {
  const container = getContainer(c.env.Node_CONTAINER, "node-runtime");
  // Extract the sub-path after /node
  const subPath = c.req.path.replace("/node", "") || "/";
  const containerUrl = new URL(`http://localhost:8080${subPath}`);
  const containerRequest = new Request(containerUrl, {
    method: c.req.method,
    headers: c.req.raw.headers,
  });
  return await container.fetch(containerRequest);
});

// Route requests to Node.js container root
app.get("/node", async (c) => {
  const container = getContainer(c.env.Node_CONTAINER, "node-runtime");
  const containerUrl = new URL("http://localhost:8080/");
  const containerRequest = new Request(containerUrl, {
    method: c.req.method,
    headers: c.req.raw.headers,
  });
  return await container.fetch(containerRequest);
});

// Route requests to Bun container (including sub-paths)
app.all("/bun/*", async (c) => {
  const container = getContainer(c.env.Bun_CONTAINER, "bun-runtime");
  // Extract the sub-path after /bun
  const subPath = c.req.path.replace("/bun", "") || "/";
  const containerUrl = new URL(`http://localhost:8080${subPath}`);
  const containerRequest = new Request(containerUrl, {
    method: c.req.method,
    headers: c.req.raw.headers,
  });
  return await container.fetch(containerRequest);
});

// Route requests to Bun container root
app.get("/bun", async (c) => {
  const container = getContainer(c.env.Bun_CONTAINER, "bun-runtime");
  const containerUrl = new URL("http://localhost:8080/");
  const containerRequest = new Request(containerUrl, {
    method: c.req.method,
    headers: c.req.raw.headers,
  });
  return await container.fetch(containerRequest);
});


export default app;
