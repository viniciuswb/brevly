# Brevly Backend

TypeScript backend API for the Brevly URL shortener service.

## Tech Stack

- **TypeScript** - Type safety and modern JavaScript features
- **Fastify** - Fast and low overhead web framework
- **Drizzle ORM** - Type-safe database toolkit and query builder
- **PostgreSQL** - Reliable relational database
- **Vitest** - Fast testing framework
- **Cloudflare R2** - Object storage for CSV exports
- **Docker** - Containerization and deployment

## Features

- ✅ Create and validate short URLs with duplicate prevention
- ✅ Delete URLs by short URL
- ✅ Retrieve original URLs with click tracking
- ✅ List all registered URLs with pagination support
- ✅ CSV export to Cloudflare R2 with secure random filenames
- ✅ CSV import from uploaded files
- ✅ Comprehensive error handling with Zod validation
- ✅ CORS enabled for all routes
- ✅ OpenAPI/Swagger documentation at `/docs`

## Development

### Prerequisites

- Node.js 22+ (Alpine Linux compatible)
- pnpm 10.14.0+
- PostgreSQL 15+ (or Docker)

### Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm run db:migrate

# Start development server with hot reload
pnpm run start:dev

# Or build and run
pnpm run build
pnpm run start
```

### Testing

```bash
# Run unit tests (services layer)
pnpm run test

# Run E2E tests (HTTP layer)
pnpm run test:e2e

# Run database migrations for test environment
pnpm run db:migrate:test
```

### Database Management

```bash
# Generate schema changes
pnpm run db:generate

# Run migrations in development
pnpm run db:migrate

# Open Drizzle Studio (database UI)
pnpm run db:studio
```

## Environment Variables

Create a `.env` file with these required variables:

```bash
# Server Configuration
PORT=3333
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/brevly
BASE_SHORT_URL=http://localhost:3333

# Cloudflare R2 (for CSV export functionality)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET=your_bucket_name
CLOUDFLARE_PUBLIC_URL=your_bucket_public_url
```

## Project Architecture

```
src/
├── app.ts                      # Fastify app configuration
├── server.ts                   # HTTP server entry point
├── env/                        # Environment validation (Zod)
├── db/                         # Database setup and schemas
│   ├── schemas/                # Drizzle table definitions
│   ├── migrations/             # Database migration files
│   └── vitest-environment/     # Custom test environment
├── repositories/               # Data access layer
│   ├── urls-repository.ts      # Repository interface
│   ├── drizzle/                # Drizzle implementations
│   └── in-memory/              # In-memory implementations for testing
├── services/                   # Business logic with co-located tests
│   ├── factories/              # Dependency injection factories
│   └── errors/                 # Custom error classes
├── http/                       # HTTP layer (routes, controllers)
│   └── controllers/urls/       # URL-related endpoints with E2E tests
└── lib/                        # Utilities (Cloudflare R2, etc.)
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3333/docs
- **OpenAPI JSON**: http://localhost:3333/docs/json

## Key Endpoints

- `POST /urls` - Create a new short URL
- `GET /urls` - List all URLs
- `GET /urls/:short_url` - Get original URL and increment click count
- `DELETE /urls/:short_url` - Delete a URL
- `POST /urls/export` - Export URLs to CSV (returns Cloudflare R2 URL)
- `POST /urls/import` - Import URLs from CSV file

## Testing Strategy

### Unit Tests (`src/services/*.spec.ts`)
- Business logic testing with in-memory repositories
- Fast execution and isolated testing
- Located alongside service files

### E2E Tests (`src/http/**/*.spec.ts`)
- Full HTTP request/response testing
- Real database integration with custom Vitest environment
- Comprehensive API behavior validation

## Code Quality

The project uses Biome for linting and formatting:
- Tabs (width 2), single quotes, semicolons as needed
- Line width: 80 characters
- Configured in `biome.json`

