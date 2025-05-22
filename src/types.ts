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
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  meta_description?: string;
  is_published: boolean;
  order: number;
  created_at: string;
  updated_at: string;

  // Hero
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  hero_content?: string;
  hero_button_text?: string;
  hero_button_url?: string;
  hero_image_src?: string;
  hero_right_content?: string;

  // Middle & end sections 
  middle_section_title?: string;
  middle_section_content?: string;
  end_section_title?: string;
  end_section_content?: string;

  // Feature section
  has_feature_section?: boolean;
  feature_section_title?: string;
  features?: PageFeature[];
}

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
  icon?: string;
  media_type: 'link' | 'video' | 'pdf' | 'audio' | 'image' | 'donation';
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
  background_image?: string;
  order: number;
  links: Link[];
}