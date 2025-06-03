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

/** Testimonial model */
export interface Testimonial {
  id: number;
  name: string;
  title?: string;
  company?: string;
  content: string;
  image?: string;
  rating: number;
  category?: string;
  is_featured: boolean;
  order: number;
}

/** Page testimonial relationship */
export interface PageTestimonial {
  id: number;
  testimonial: Testimonial;
  order: number;
}

/** Page model - UPDATED with landing page features */
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

  // Page type - NEW
  page_type: 'page' | 'landing';
  is_landing_page: boolean;

  // Hero - existing fields
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  hero_content?: string;
  hero_button_text?: string;
  hero_button_url?: string;
  hero_image_src?: string;
  hero_right_content?: string;

  // Hero - NEW landing page fields
  hero_video_url?: string;
  hero_button_2_text?: string;
  hero_button_2_url?: string;
  show_prelaunch_badge?: boolean;
  prelaunch_badge_text?: string;
  show_countdown?: boolean;
  countdown_target_date?: string;
  countdown_title?: string;
  show_social_proof?: boolean;
  social_proof_title?: string;
  show_scroll_indicator?: boolean;

  // Middle & end sections 
  middle_section_title?: string;
  middle_section_content?: string;
  end_section_title?: string;
  end_section_content?: string;

  // Feature section
  has_feature_section?: boolean;
  feature_section_title?: string;
  features?: PageFeature[];

  // Testimonials - NEW
  testimonials?: PageTestimonial[];
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

// NEW: Authentication Types

/** User model */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  profile: UserProfile;
}

/** User Profile model */
export interface UserProfile {
  phone: string;
  birth_date: string;
  email_verified: boolean;
  email_marketing: boolean;
  receive_order_updates: boolean;
  email_verification_token?: string;
  email_verification_sent_at?: string;
}

/** Authentication response from login */
export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

/** Registration data */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

/** Login credentials */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Password change data */
export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

/** Profile update data */
export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  email_marketing?: boolean;
  receive_order_updates?: boolean;
}

/** API Error response */
export interface ApiError {
  detail?: string;
  errors?: Record<string, string[]>;
  non_field_errors?: string[];
}

// NEW: Course Types

/** Course model */
export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: number;
  featured_image?: string;
  video_preview?: string;
  duration_weeks: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_published: boolean;
  is_featured: boolean;
  category?: CourseCategory;
  instructor: CourseInstructor;
  lessons: CourseLesson[];
  enrollments_count: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

/** Course Category model */
export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

/** Course Instructor model */
export interface CourseInstructor {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  expertise_areas: string[];
}

/** Course Lesson model */
export interface CourseLesson {
  id: number;
  title: string;
  slug: string;
  content: string;
  video_url?: string;
  duration_minutes: number;
  order: number;
  is_free: boolean;
}

/** Course Enrollment model */
export interface CourseEnrollment {
  id: number;
  course: Course;
  user: User;
  enrolled_at: string;
  progress_percentage: number;
  completed_at?: string;
  last_accessed?: string;
}

/** Lesson Progress model */
export interface LessonProgress {
  id: number;
  lesson: CourseLesson;
  enrollment: CourseEnrollment;
  completed: boolean;
  completed_at?: string;
  time_spent_minutes: number;
}

// NEW: Calendar/Event Types

/** Event model */
export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  location?: string;
  virtual_link?: string;
  event_type: 'meeting' | 'workshop' | 'webinar' | 'consultation' | 'other';
  is_public: boolean;
  max_attendees?: number;
  registration_required: boolean;
  registration_deadline?: string;
  price: number;
  featured_image?: string;
  organizer: User;
  attendees: EventAttendee[];
  created_at: string;
  updated_at: string;
}

/** Event Attendee model */
export interface EventAttendee {
  id: number;
  event: Event;
  user: User;
  registered_at: string;
  attended: boolean;
  notes?: string;
}

/** Calendar view data */
export interface CalendarData {
  events: Event[];
  month: number;
  year: number;
}