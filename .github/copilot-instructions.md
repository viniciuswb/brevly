# Brevly URL Shortener Service

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

Brevly is a URL shortener service built with TypeScript, featuring a Fastify server with PostgreSQL database. The web client is planned but not yet implemented.

## Working Effectively

### Initial Setup (First Time Only)
Bootstrap the repository in this exact order:

1. **Install pnpm globally:**
   ```bash
   npm install -g pnpm
   ```

2. **Install server dependencies:**
   ```bash
   cd server && pnpm install
   ```
   - Takes ~40 seconds. NEVER CANCEL. Set timeout to 90+ seconds.

3. **Start PostgreSQL database:**
   ```bash
   cd server && docker compose up -d
   ```
   - Takes ~5 seconds for startup. Database pulls Docker image on first run (~30 seconds).

4. **Setup environment variables:**
   ```bash
   cd server && cp .env.example .env
   ```

5. **Run database migrations:**
   ```bash
   cd server && pnpm run db:migrate
   ```
   - Takes ~2 seconds. NEVER CANCEL.

### Development Workflow

**Start the development server:**
```bash
cd server && pnpm run start:dev
```
- Takes ~2 seconds to start. NEVER CANCEL.
- Server runs on http://localhost:3333
- API documentation available at http://localhost:3333/docs

**Run tests:**
```bash
# Unit tests
cd server && pnpm run test
```
- Takes ~1.5 seconds. NEVER CANCEL. Set timeout to 30+ seconds.

```bash
# End-to-end tests  
cd server && pnpm run test:e2e
```
- Takes ~3 seconds. NEVER CANCEL. Set timeout to 30+ seconds.

**Lint and format code:**
```bash
cd server && pnpm exec biome check . --files-ignore-unknown=true
```
- Takes < 1 second. NEVER CANCEL.
- May show schema version warning (safe to ignore)

**Format code automatically:**
```bash
cd server && pnpm exec biome format . --write
```

## Validation Scenarios

**ALWAYS test these scenarios after making changes to ensure functionality:**

1. **Test server startup and API availability:**
   ```bash
   curl -s http://localhost:3333/docs | grep -q "Swagger UI"
   ```

2. **Test creating a short URL:**
   ```bash
   curl -X POST http://localhost:3333/urls \
     -H "Content-Type: application/json" \
     -d '{"originalUrl": "https://example.com", "shortUrl": "test123"}'
   ```
   - Should return JSON with id, originalUrl, shortUrl, clickCount, and createdAt

3. **Test URL redirection:**
   ```bash
   curl -I http://localhost:3333/urls/test123
   ```
   - Should return HTTP 302 with Location header pointing to original URL

4. **Test invalid URL creation:**
   ```bash
   curl -X POST http://localhost:3333/urls \
     -H "Content-Type: application/json" \
     -d '{"originalUrl": "invalid-url", "shortUrl": "test"}'
   ```
   - Should return HTTP 400 validation error

## Project Structure

```
server/                 # Main server application
├── src/
│   ├── app.ts         # Fastify app configuration
│   ├── server.ts      # Server entry point
│   ├── env/           # Environment variable validation
│   ├── db/            # Database schemas, migrations, connection
│   ├── http/          # HTTP controllers and routes
│   ├── services/      # Business logic services
│   └── repositories/ # Data access layer
├── package.json       # Dependencies and scripts
├── docker-compose.yml # PostgreSQL database setup
├── biome.json        # Linting/formatting configuration
└── vite.config.ts    # Test configuration

web/                   # Frontend (planned - not implemented)
├── README.md         # Frontend requirements
└── .env.example      # Frontend environment variables
```

## Key Technologies

- **Runtime:** Node.js v20.19.4
- **Package Manager:** pnpm v10.14.0
- **Server:** Fastify with TypeScript
- **Database:** PostgreSQL via Docker
- **ORM:** Drizzle ORM
- **Testing:** Vitest (unit + e2e)
- **Linting:** Biome
- **API Documentation:** Swagger/OpenAPI

## Important Commands

**Database operations:**
```bash
cd server && pnpm run db:generate    # Generate migrations from schema changes
cd server && pnpm run db:migrate     # Apply migrations to database  
cd server && pnpm run db:studio      # Open Drizzle Studio (database GUI)
```

**Testing variations:**
```bash
cd server && pnpm run test           # Unit tests only
cd server && pnpm run test:e2e       # E2E tests only
```

## Common Issues and Solutions

**Database connection issues:**
- Ensure Docker is running: `docker --version`
- Check database status: `cd server && docker compose ps`
- Restart database: `cd server && docker compose restart`

**Port conflicts:**
- Default server port: 3333
- Default database port: 5432
- Check if ports are in use: `netstat -tulpn | grep :3333`

**Environment issues:**
- Ensure .env file exists: `ls server/.env`
- Verify environment variables: `cd server && cat .env`

## Critical Development Rules

- **NEVER CANCEL builds or long-running commands** - Builds may take up to 60 seconds, tests up to 30 seconds
- **ALWAYS run all tests before committing** - Both unit and e2e tests must pass
- **ALWAYS lint code before committing** - Use `biome check` to validate code style
- **ALWAYS validate API functionality** - Test at least one create/redirect scenario manually
- **ALWAYS start with database running** - Most operations require PostgreSQL to be up

## Available Scripts Reference

**From server/package.json:**
- `start:dev` - Start development server with file watching
- `test` - Run unit tests 
- `test:e2e` - Run end-to-end tests
- `db:generate` - Generate database migrations
- `db:migrate` - Apply database migrations
- `db:migrate:test` - Apply migrations for test database
- `db:studio` - Open database management interface

## API Endpoints

- `POST /urls` - Create new short URL
- `GET /urls/:shortUrl` - Redirect to original URL (or return URL data)
- `GET /docs` - API documentation (Swagger UI)

## File Locations for Common Tasks

**Adding new API endpoints:** `server/src/http/controllers/`
**Database schema changes:** `server/src/db/schemas/`
**Business logic:** `server/src/services/`
**Environment configuration:** `server/src/env/index.ts`
**Test files:** Co-located with source files (`.spec.ts`)