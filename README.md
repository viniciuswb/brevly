# Brevly

## Description

Brevly is a URL shortener service that allows users to create short links for their long URLs. Built with a TypeScript backend using Fastify and PostgreSQL, and a React frontend with modern tooling.

## Architecture

This is a monorepo containing:
- `server/` - TypeScript backend using Fastify, Drizzle ORM, and PostgreSQL
- `web/` - React frontend using Vite, Tailwind CSS, and React Query

## Quick Start with Docker (Recommended)

The easiest way to run the entire application is using Docker Compose:

```bash
# Start all services (PostgreSQL, backend, frontend)
docker-compose up

# Or run in detached mode
docker-compose up -d

# Rebuild and start (useful after code changes)
docker-compose up --build

# Stop and remove all containers
docker-compose down
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3333
- **API Documentation**: http://localhost:3333/docs
- **PostgreSQL**: localhost:5432

### Running Database Migrations

After starting with Docker for the first time, run migrations:

```bash
docker exec brevly-server-1 pnpm run db:migrate
```

## Environment Variables

For Cloudflare R2 integration (CSV export functionality), set these environment variables:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET=your_bucket_name
CLOUDFLARE_PUBLIC_URL=your_bucket_public_url
```

## Development

For local development without Docker, see the individual README files:
- [Server Development](./server/README.md)
- [Web Development](./web/README.md)

## Features

- Create and manage short URLs
- Click tracking and analytics
- CSV export/import functionality
- Responsive web interface
- REST API with Swagger documentation
