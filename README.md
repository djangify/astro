# Corrison - Headless E-commerce & CMS Platform

A modern, API-first headless platform built with Django REST Framework backend and Astro frontend, designed for e-commerce, content management, and advanced landing pages.

## About This Project

Corrison is a comprehensive headless platform that combines e-commerce functionality with a powerful CMS and advanced landing page capabilities. The frontend is built with Astro for optimal performance, while the Django backend provides a robust API-first architecture.

**Live Examples:**
- **Main Site**: [corrisonapi.com](https://www.corrisonapi.com) - Consuming Pages, Blog and LinkHub APIs
- **Portfolio Site**: [todiane.com](https://www.todiane.com) - Consuming Pages and LinkHub APIs
- **API Backend**: [corrison.corrisonapi.com](https://corrison.corrisonapi.com) - Django REST Framework API

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ E-commerce  │ │ CMS Frontend│ │ LinkHub     │           │
│  │ (Astro.js)  │ │ (Astro.js)  │ │ (Astro.js)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                API Gateway Layer                            │
│         Passenger WSGI • CORS • JWT Auth                   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              API Layer (Django REST Framework)             │
│  Products • Cart • Blog • Pages • LinkHub • Testimonials  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                Infrastructure Layer                         │
│        Database (MariaDB) • Media Storage • Static Files   │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### 🛍️ **E-commerce Module**
- Product catalog with categories and variants
- Shopping cart and checkout system
- Order management and processing
- Stripe payment integration

### 📝 **Content Management System**
- Blog posts with featured images and YouTube embeds
- Dynamic pages with rich content
- File attachments and media management
- SEO-optimized meta fields

### 🎯 **Advanced Landing Pages**
- **Video Backgrounds**: YouTube and custom video support
- **Countdown Timers**: Real-time countdown to launch dates
- **Prelaunch Badges**: "Coming Soon" and custom badges
- **Dual CTAs**: Primary and secondary call-to-action buttons
- **Social Proof**: Integrated testimonial sections
- **Scroll Indicators**: Animated scroll-down indicators

### 🌟 **Testimonial System**
- Global testimonial management
- Star ratings (1-5 scale)
- Category-based filtering
- Featured testimonial highlighting
- Multi-page testimonial relationships
- Customer photos and company details

### 🔗 **LinkHub (Link-in-Bio)**
- Multi-media link collections
- Support for videos, PDFs, audio, donations
- Custom icons and descriptions
- Author attribution
- Background image support

### 🎨 **Enhanced Hero Sections**
- **Regular Pages**: Standard hero with image/content options
- **Landing Pages**: Advanced hero with video, countdown, dual CTAs
- **Content Flexibility**: Rich text content or custom right-side content
- **Image Options**: Upload or external URL support

## API Endpoints

### Pages API
```
GET    /api/v1/pages/                    # List all pages
GET    /api/v1/pages/{slug}/             # Get specific page
GET    /api/v1/pages/?type=landing       # Filter by page type
GET    /api/v1/pages/landing_pages/      # Get landing pages only
```

### Blog API
```
GET    /api/v1/blog/posts/              # List all blog posts
GET    /api/v1/blog/posts/{slug}/       # Get specific blog post
```

### Testimonials API
```
GET    /api/v1/testimonials/                    # List all testimonials
GET    /api/v1/testimonials/featured/           # Get featured testimonials
GET    /api/v1/testimonials/?category={cat}     # Filter by category
GET    /api/v1/testimonials/categories/         # Get available categories
GET    /api/v1/pages/{slug}/testimonials/       # Get testimonials for specific page
```

### LinkHub API
```
GET    /api/v1/linkhubs/                # List all link hubs
GET    /api/v1/linkhubs/{slug}/         # Get specific link hub
```

## Technology Stack

**Frontend:**
- **Framework**: Astro.js (Static Site Generation)
- **Styling**: Tailwind CSS
- **Components**: Astro components with TypeScript
- **Performance**: Image optimization, lazy loading

**Backend:**
- **Framework**: Django + Django REST Framework
- **Database**: MariaDB/MySQL
- **Authentication**: JWT-based
- **Media**: Django file handling with WhiteNoise
- **Hosting**: Hetzner Cloud with HestiaCP

**Infrastructure:**
- **Frontend Hosting**: Static deployment (Netlify, Vercel, etc.)
- **Backend Hosting**: Hetzner CPX21 (Helsinki)
- **CDN**: Frontend assets served via CDN
- **SSL**: Let's Encrypt certificates

## Installation & Setup

### Prerequisites
- Node.js (version 18.0.0 or higher)
- npm or yarn package manager
- Access to Corrison API backend

### Frontend Setup

1. **Clone and install:**
```bash
git clone https://github.com/djangify/astro.git
cd astro
npm install
```

2. **Environment configuration:**
```bash
# Create .env file
cp .env.example .env
```

3. **Configure environment variables:**
```env
PUBLIC_API_BASE_URL=https://corrison.corrisonapi.com
PUBLIC_SITE_URL=https://your-domain.com
```

4. **Development server:**
```bash
npm run dev
# Available at http://localhost:4321
```

5. **Production build:**
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/              # Reusable components
│   ├── EnhancedHero.astro      # Advanced hero for landing pages
│   ├── TestimonialGrid.astro   # Testimonial display component
│   ├── CountdownTimer.astro    # Countdown timer component
│   ├── Header.astro            # Site navigation
│   └── Footer.astro            # Site footer
├── layouts/
│   └── BaseLayout.astro        # Main page layout
├── pages/                   # Route pages
│   ├── index.astro             # Homepage (supports landing pages)
│   ├── blog/                   # Blog routes
│   │   ├── index.astro         # Blog listing
│   │   └── [slug].astro        # Individual blog posts
│   ├── linkhubs.astro          # LinkHub display
│   └── architecture.astro      # Platform documentation
├── lib/
│   ├── api.ts                  # API integration functions
│   └── heroicons.ts            # Icon helper functions
├── utils/                   # Utility functions
│   ├── blog.ts                 # Blog-related utilities
│   ├── images.ts               # Image optimization
│   ├── permalinks.ts           # URL generation
│   └── frontmatter.ts          # Content processing
├── styles/
│   └── global.css              # Global styles and Tailwind
└── types.ts                 # TypeScript definitions
```

## Component Usage

### Enhanced Hero Section
```astro
---
import EnhancedHero from "../components/EnhancedHero.astro";
---

<EnhancedHero page={page} />
```

**Features:**
- Automatic video background detection
- Countdown timer integration
- Dual CTA button support
- Prelaunch badge display
- Scroll indicator animation

### Testimonial Grid
```astro
---
import TestimonialGrid from "../components/TestimonialGrid.astro";
---

<TestimonialGrid 
  testimonials={page.testimonials}
  title="What Our Customers Say"
  columns={3}
/>
```

### Countdown Timer
```astro
---
import CountdownTimer from "../components/CountdownTimer.astro";
---

<CountdownTimer 
  targetDate="2024-12-31T23:59:59"
  title="Launch Countdown"
  className="text-center"
/>
```

## API Integration Examples

### Fetching Landing Pages
```typescript
import { fetchLandingPages, fetchPagesByType } from "../lib/api";

// Get all landing pages
const landingPages = await fetchLandingPages();

// Get pages by type
const regularPages = await fetchPagesByType('page');
const landingPages = await fetchPagesByType('landing');
```

### Working with Testimonials
```typescript
import { 
  fetchTestimonials, 
  fetchFeaturedTestimonials,
  fetchPageTestimonials 
} from "../lib/api";

// Get all testimonials
const testimonials = await fetchTestimonials();

// Get featured testimonials only
const featured = await fetchFeaturedTestimonials();

// Get testimonials for specific page
const pageTestimonials = await fetchPageTestimonials('homepage');
```

### Blog Integration
```typescript
import { fetchPosts, fetchPost } from "../lib/api";

// Get all blog posts
const posts = await fetchPosts();

// Get specific blog post
const post = await fetchPost('my-blog-post-slug');
```

## Page Types

### Regular Pages
Standard content pages with:
- Basic hero section
- Rich text content
- Feature sections
- Image/content flexibility

### Landing Pages
Advanced marketing pages with:
- Video background support
- Countdown timers
- Prelaunch badges
- Dual CTA buttons
- Social proof sections
- Enhanced hero components

## Configuration

### Astro Configuration
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### API Configuration
```typescript
// src/lib/api.ts
const API = "https://corrison.corrisonapi.com";

async function check<T>(res: Response, what: string): Promise<T> {
  if (!res.ok) throw new Error(`Failed to fetch ${what}`);
  return res.json();
}
```

## Deployment

### Static Deployment (Recommended)
1. **Build the project:**
```bash
npm run build
```

2. **Deploy `dist/` folder to:**
   - Netlify
   - Vercel  
   - AWS S3 + CloudFront
   - GitHub Pages
   - Any static hosting service

### Environment Variables for Production
```env
PUBLIC_API_BASE_URL=https://corrison.corrisonapi.com
PUBLIC_SITE_URL=https://your-production-domain.com
```

## Backend Features

The Django backend provides:

### E-commerce Capabilities
- Product management with variants
- Cart and checkout functionality
- Order processing and management
- Stripe payment integration
- Inventory tracking

### Content Management
- Rich text editing for all content fields
- Image upload and optimization
- SEO meta fields
- Publishing controls

### Landing Page Features
- Page type classification (page/landing)
- Video background URL support
- Countdown timer configuration
- Testimonial relationship management
- Advanced hero section options

### API Features
- RESTful endpoint design
- JWT authentication
- CORS configuration
- Pagination support
- Filtering and search capabilities

## Development

### Adding New Components
1. Create component in `src/components/`
2. Import and use in pages
3. Add TypeScript definitions in `src/types.ts`
4. Update API functions in `src/lib/api.ts` if needed

### Styling Guidelines
- Use Tailwind CSS utility classes
- Global styles in `src/styles/global.css`
- Component-specific styles in Astro components
- Responsive design with mobile-first approach

### Performance Optimization
- Images automatically optimized via Astro
- Lazy loading implemented
- Static generation for fast loading
- CDN-friendly asset structure

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues:**
- Verify `PUBLIC_API_BASE_URL` in environment
- Check CORS settings on backend
- Confirm API endpoint URLs

**Component Not Rendering:**
- Check TypeScript types match API response
- Verify component props are correctly passed
- Check browser console for errors

### Windows Development
If switching from WSL to Windows:
1. Reinstall Node.js for Windows
2. Clear npm cache: `npm cache clean --force`
3. Delete and reinstall node_modules
4. Update file paths in any scripts

## API Response Examples

### Page Response
```json
{
  "id": 1,
  "slug": "homepage",
  "title": "Welcome to Corrison",
  "page_type": "landing",
  "hero_title": "Transform Your Business",
  "hero_video_url": "https://youtube.com/watch?v=example",
  "show_countdown": true,
  "countdown_target_date": "2024-12-31T23:59:59Z",
  "testimonials": [...]
}
```

### Testimonial Response
```json
{
  "id": 1,
  "name": "John Doe",
  "title": "CEO",
  "company": "Example Corp",
  "content": "Corrison transformed our business...",
  "rating": 5,
  "category": "business",
  "image": "/media/testimonials/john.jpg"
}
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Follow existing code patterns and TypeScript definitions
4. Test with both regular and landing page types
5. Submit pull request with clear description

## Scripts Reference

```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run preview  # Preview production build
npm run astro    # Run Astro CLI commands
```

## Support & Documentation

- **Frontend Issues**: Open issue in this repository
- **Backend API**: Contact Corrison API team
- **Architecture**: See `/architecture` page
- **Live Examples**: Visit corrisonapi.com and todiane.com

## License

MIT

---

**Developer**: Diane Corriette  
**Website**: [djangify.com](https://www.djangify.com)  
**GitHub**: [github.com/djangify](https://github.com/djangify)

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Development server running (`npm run dev`)
- [ ] API connection tested with corrison.corrisonapi.com
- [ ] Familiar with page types (regular vs landing)
- [ ] Production build successful (`npm run build`)

## Recent Updates

### Enhanced Landing Page Features
- **Video Backgrounds**: Full YouTube and custom video support
- **Countdown Timers**: Real-time countdown with customizable styling
- **Advanced Hero**: Multiple CTA buttons, prelaunch badges, scroll indicators
- **Social Proof**: Integrated testimonial system with star ratings
- **Page Types**: Clear distinction between regular pages and landing pages

### Testimonial System
- **Global Management**: Reusable testimonials across multiple pages
- **Rich Data**: Customer photos, ratings, company information
- **Flexible Display**: Category filtering and featured testimonial support
- **API Integration**: Complete CRUD operations via REST API

### Performance Enhancements
- **Image Optimization**: Automatic image processing and lazy loading
- **Static Generation**: Optimized build process for fast loading
- **Component Architecture**: Modular design for maintainability