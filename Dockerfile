# 1. Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build

# 2. Serve Stage
FROM nginx:alpine
# Remove default content
RUN rm -rf /usr/share/nginx/html/*
# Copy built static files
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Expose HTTP port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
