// src/lib/api.ts
import type { BlogPost, Page, LinkHub } from "../types";
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

/** Pages */
export function fetchPages(): Promise<Page[]> {
  return fetch(`${API}/api/v1/pages/`).then(r => check<Page[]>(r, "pages"));
}
export function fetchPage(slug: string): Promise<Page> {
  return fetch(`${API}/api/v1/pages/${slug}/`).then(r => check<Page>(r, "page"));
}

/** LinkHubs */
export function fetchLinkHubs(): Promise<LinkHub[]> {
  return fetch(`${API}/api/v1/linkhubs/`).then(r => check<LinkHub[]>(r, "link hubs"));
}
export function fetchLinkHub(slug: string): Promise<LinkHub> {
  return fetch(`${API}/api/v1/linkhubs/${slug}/`).then(r => check<LinkHub>(r, "link hub"));
}

