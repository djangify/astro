// src/types.ts

/** BlogPost model */
export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  created_at: string;
  is_published: boolean;
  published_at: string | null;
  featured_image?: string;
  youtube_url?: string;
  attachment?: string;
  is_featured: boolean;
}

/** Page model */
export interface Page {
  title: string;
  slug: string;
  subtitle?: string;
  hero_image?: string;
  content: string;
  meta_description?: string;
  is_published: boolean;
  published_at?: string;
  order: number;
  created_at: string;
  updated_at: string;

  // New fields for hero section
  hero_title?: string;
  hero_subtitle?: string;
  hero_content?: string;

  // Fields for feature section
  has_feature_section: boolean;
  feature_section_title?: string;
  features?: PageFeature[];
}

/** PageFeature model */
export interface PageFeature {
  id: number;
  title?: string;
  content: string;
  icon?: string;
  order: number;
}

/** Link with media capabilities model */
export interface Link {
  id: number;
  title: string;
  url: string;
  icon_url?: string;
  media_type: 'link' | 'video' | 'pdf' | 'audio' | 'image';
  media_type_display: string;
  description?: string;
  author?: string;
  order: number;
}

/** LinkHub model */
export interface LinkHub {
  id: number;
  title: string;
  slug: string;
  description?: string;
  order: number;
  links: Link[];
}