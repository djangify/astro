// src/lib/api.ts
import type { BlogPost, Page, LinkHub, Testimonial } from "../types";
const API = "https://corrison.corrisonapi.com";

async function check<T>(res: Response, what: string): Promise<T> {
  if (!res.ok) throw new Error(`Failed to fetch ${what}`);
  return res.json();
}

/** Blogs live under /api/v1/blog/posts/ on your DRF router */
export function fetchPosts(): Promise<BlogPost[]> {
  return fetch(`${API}/api/v1/blog/posts/`).then(r => check<BlogPost[]>(r, "posts"));
}
export function fetchPost(slug: string): Promise<BlogPost> {
  return fetch(`${API}/api/v1/blog/posts/${slug}/`).then(r => check<BlogPost>(r, "post"));
}

/** Pages - UPDATED with support for page types */
export function fetchPages(): Promise<Page[]> {
  return fetch(`${API}/api/v1/pages/`).then(r => check<Page[]>(r, "pages"));
}

export function fetchPage(slug: string): Promise<Page> {
  return fetch(`${API}/api/v1/pages/${slug}/`).then(r => check<Page>(r, "page"));
}

/** NEW: Fetch pages by type */
export function fetchPagesByType(type: 'page' | 'landing'): Promise<Page[]> {
  return fetch(`${API}/api/v1/pages/?type=${type}`).then(r => check<Page[]>(r, `${type} pages`));
}

/** NEW: Fetch landing pages specifically */
export function fetchLandingPages(): Promise<Page[]> {
  return fetch(`${API}/api/v1/pages/landing_pages/`).then(r => check<Page[]>(r, "landing pages"));
}

/** NEW: Fetch testimonials for a specific page */
export function fetchPageTestimonials(slug: string, category?: string): Promise<{
  page: string;
  testimonials: Testimonial[];
  count: number;
}> {
  const url = category
    ? `${API}/api/v1/pages/${slug}/testimonials/?category=${category}`
    : `${API}/api/v1/pages/${slug}/testimonials/`;
  return fetch(url).then(r => check(r, "page testimonials"));
}

/** NEW: Testimonials API */
export function fetchTestimonials(): Promise<Testimonial[]> {
  return fetch(`${API}/api/v1/testimonials/`).then(r => check<Testimonial[]>(r, "testimonials"));
}

export function fetchFeaturedTestimonials(): Promise<Testimonial[]> {
  return fetch(`${API}/api/v1/testimonials/featured/`).then(r => check<Testimonial[]>(r, "featured testimonials"));
}

export function fetchTestimonialsByCategory(category: string): Promise<Testimonial[]> {
  return fetch(`${API}/api/v1/testimonials/?category=${category}`).then(r => check<Testimonial[]>(r, "testimonials by category"));
}

export function fetchTestimonialCategories(): Promise<{
  categories: string[];
  count: number;
}> {
  return fetch(`${API}/api/v1/testimonials/categories/`).then(r => check(r, "testimonial categories"));
}

/** LinkHubs */
export function fetchLinkHubs(): Promise<LinkHub[]> {
  return fetch(`${API}/api/v1/linkhubs/`).then(r => check<LinkHub[]>(r, "link hubs"));
}
export function fetchLinkHub(slug: string): Promise<LinkHub> {
  return fetch(`${API}/api/v1/linkhubs/${slug}/`).then(r => check<LinkHub>(r, "link hub"));
}
