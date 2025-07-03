# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload (runs on localhost:8787)
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run start` - Alias for `npm run dev`
- `npm run cf-typegen` - Generate TypeScript types from wrangler configuration

## Project Architecture

This is a Cloudflare Workers project demonstrating how Hono web framework runs across different JavaScript runtimes (Node.js, Bun, and Deno) using Cloudflare Containers.

### Key Components

- **Worker Entry Point**: `src/index.ts` - Main router that delegates to different container runtimes
- **Container Classes**: Three separate container classes for Node, Bun, and Deno runtimes
- **Configuration**: `wrangler.jsonc` defines three container configurations with separate runtime environments

### Container Runtime Architecture

The project should have separate routes for each JavaScript runtime:
- `/node` - Routes to NodeContainer running Node.js with Hono
- `/bun` - Routes to BunContainer running Bun with Hono  
- `/deno` - Routes to DenoContainer running Deno with Hono

Each container runs the same Hono application code but in different JavaScript runtime environments to showcase compatibility and performance differences.

### Durable Objects Configuration

Three container types configured in `wrangler.jsonc`:
- **NodeContainer** (node-container) - Node.js runtime
- **BunContainer** (bun-container) - Bun runtime
- **DenoContainer** (deno-container) - Deno runtime

Each has max_instances of 5 and corresponding Durable Object bindings (Node_CONTAINER, Bun_CONTAINER, Deno_CONTAINER).

### Container Implementation Details

- Default port: 8080 for all containers
- Sleep timeout: 2 minutes of inactivity
- Environment variables passed via `envVars` property
- Lifecycle hooks available (onStart, onStop, onError)
- Each container should run identical Hono application code in different runtimes

### Expected Project Structure

The `container_src/` directory should contain the runtime-specific implementations or a shared Hono application that runs across all three JavaScript runtimes, demonstrating Hono's cross-runtime compatibility.