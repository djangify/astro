# Base Node image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the Astro app
RUN npm run build

# Production stage with minimal image
FROM node:18-alpine AS runtime

# Set working directory
WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

# Expose the port the app will run on
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["node", "./dist/server/entry.mjs"]