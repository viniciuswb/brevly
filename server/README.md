## Description and Requirements

This is the server-side code for the Brevly URL shortener service. 

### Tech Stack

- TypeScript
- Drizzle
- PostgreSQL
- Fastify
- Docker
- Cloudflare
- Vitest

### Functionality and rules

* [] Should be able to create a link
  * [] Should not be able to create a link with a short URL that is not a valid URL
  * [] Should not be able to create a link with a short URL that already exists
* [] Should be able to delete a link
* [] Should be able to get the original URL from a short URL
* [] Should be able to list all registered URLs
* [] Should be able to increment the click count for a short URL
* [] Should be able to export the registered URLs to a CSV file
* [] Should be able to import the registered URLs from a CSV file
  * [] Should be able to access the CSV file using a CDN (e.g. Cloudflare, AWS S3)
  * [] CSV File should have a random name
  * [] Should be able to generate the list in a performant way
  * [] CSV should have the following columns: short_url, original_url, click_count and created_at

### Technical requirements
* CORS should be enabled for all routes
* Should be able to run using docker
* Should have Unit tests
* Should have Integration and End-to-End tests

### Environment variables

````
PORT=
DATABASE_URL=

CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
````

### Setup

1. Install dependencies
```
pnpm install
```
2. Set up environment variables
```
cp .env.example .env
```
3. Run database Migrations
```
pnpm run db:migrate
```
4. Run the development server
```
pnpm run dev
```

