FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set build-time environment variables
ARG VITE_BACKEND_URL=http://localhost:3333
ARG VITE_FRONTEND_URL=http://localhost:5173
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 5173

# Use Vite preview to serve the built application
CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "5173"]