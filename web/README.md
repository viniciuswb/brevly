# Brevly Frontend

React-based frontend for the Brevly URL shortener service.

## Tech Stack

- **TypeScript** - Type safety and better developer experience
- **React** - UI library with hooks and modern patterns
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and state management
- **React Hook Form + Zod** - Form handling and validation
- **React Router** - Client-side routing

## Features

- ✅ Create and validate short URLs
- ✅ List and manage existing URLs
- ✅ Delete URLs with confirmation
- ✅ URL redirection with loading states
- ✅ CSV export functionality with visual feedback
- ✅ Responsive design for desktop and mobile
- ✅ Error handling and empty states
- ✅ Loading indicators throughout the app

## Development

### Prerequisites

- Node.js 22+ (Alpine Linux compatible)
- pnpm 10.14.0+

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Run linter
pnpm run lint
```

### Environment Variables

Create a `.env.local` file:

```bash
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3333
```

## Project Structure

```
src/
├── App.tsx                    # Main app with routing
├── main.tsx                   # Application entry point
├── components/
│   ├── brevly-app.tsx         # Main layout and state management
│   ├── brevly-url-list.tsx    # URL list with CRUD operations
│   ├── brevly-link-form.tsx   # Form for creating URLs
│   ├── brevly-icons.tsx       # Phosphor icon components
│   ├── brevly-not-found-page.tsx    # 404 page
│   ├── brevly-redirecting-page.tsx  # URL redirect handling
│   └── ui/                    # Reusable UI components
├── http/                      # API client and React Query hooks
└── lib/                       # Utilities and configurations
```

## Pages

- **`/`** - Home page with URL creation form and list
- **`/:short_url`** - Redirect page that fetches and redirects to original URL
- **`/404`** - Not found page for invalid routes or non-existent short URLs

## Code Quality

The project uses Biome for linting and formatting:
- Tabs (width 2), single quotes, semicolons as needed
- Line width: 80 characters
- Configured in `biome.json`

## API Integration

The frontend communicates with the backend API through:
- React Query for data fetching and caching
- Custom hooks in `src/http/` for API operations
- Automatic error handling and loading states

