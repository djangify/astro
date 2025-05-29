# Corrison API with Astro Frontend

A modern frontend application built with Astro that connects to the Corrison API backend for data processing and management.

## About This Project

This is a static site generator frontend built with Astro that serves as the user interface for the Corrison API system. The frontend provides a fast, modern web experience while communicating with the Django-based Corrison API backend hosted at `corrison.corrisonapi.com`.

## Architecture

- **Frontend**: Astro-based static site generator
- **Backend**: Django REST API at `corrison.corrisonapi.com`
- **Communication**: RESTful API calls between frontend and backend
- **Deployment**: Static files can be deployed to any CDN or static hosting service

## Features

- Fast, modern web interface built with Astro
- Server-side rendering (SSR) and static site generation (SSG) capabilities
- Responsive design for desktop and mobile
- Integration with Corrison API for data operations
- Optimized performance with Astro's island architecture

## Prerequisites

- Node.js (version 16.12.0 or higher)
- npm or yarn package manager
- Access to the Corrison API backend

## Installation

1. Clone the repository:

```bash
git clone https://github.com/djangify/astro.git
cd astro
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env file
cp .env.example .env

# Edit .env with your configuration
CORRISON_API_URL=https://corrison.corrisonapi.com
```

## Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Building for Production

Build the static site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## API Integration

This frontend connects to the Corrison API backend with the following endpoints:

- **Base URL**: `https://corrison.corrisonapi.com/api/`
- **Authentication**: API key or token-based (configure in .env)
- **Data Format**: JSON

### Common API Calls

```javascript
// Example API integration
const API_BASE = "https://corrison.corrisonapi.com/api/";

// Fetch data from Corrison API
async function fetchCorrisonData(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
```

## Project Structure

```
├── src/
│   ├── components/          # Reusable Astro components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Route pages
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions and API helpers
├── public/                 # Static assets
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Configuration

### Astro Configuration (`astro.config.mjs`)

```javascript
import { defineConfig } from "astro/config";

export default defineConfig({
  // Your Astro configuration
  output: "static", // or 'server' for SSR
  integrations: [
    // Add integrations as needed
  ],
});
```

### Environment Variables

Create a `.env` file in the root directory:

```env
CORRISON_API_URL=https://corrison.corrisonapi.com
CORRISON_API_KEY=your_api_key_here
PUBLIC_SITE_URL=https://your-frontend-domain.com
```

## Deployment

### Static Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist/` folder to your preferred hosting service:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

### Server Deployment (SSR)

If using server-side rendering, deploy to a Node.js hosting service:

- Vercel
- Netlify Functions
- AWS Lambda
- Traditional VPS with Node.js

## Troubleshooting

### Common Issues

1. **Build fails on Windows**:

   - Delete `node_modules` and `package-lock.json`
   - Run `npm cache clean --force`
   - Reinstall with `npm install`

2. **API connection issues**:

   - Check environment variables
   - Verify API endpoint URLs
   - Check CORS settings on backend

3. **Development server issues**:
   - Check port availability
   - Clear browser cache
   - Restart development server

### Windows-Specific Setup

If you recently switched from WSL to Windows:

1. Reinstall Node.js for Windows
2. Clear npm cache: `npm cache clean --force`
3. Delete and reinstall node_modules
4. Check file path separators in any build scripts

## API Backend Information

The backend Corrison API (`corrison.corrisonapi.com`) provides:

- RESTful API endpoints for data operations
- Authentication and authorization
- Data validation and processing
- Database management through Django ORM

### Backend Features Accessed by Frontend:

- User authentication and management
- Data CRUD operations
- File upload and processing
- Real-time data updates
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

## Support

For issues related to:

- **Frontend**: Open an issue in this repository
- **Backend API**: Contact the Corrison API team
- **Deployment**: Check hosting service documentation

## License

[Add your license information here]

---

## Quick Start Checklist

- [ ] Node.js installed (16.12.0+)
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Development server running (`npm run dev`)
- [ ] API connection tested
- [ ] Production build successful (`npm run build`)

Developer: Diane Corriette
https://www.djangify.com

https://github.com/djangify
