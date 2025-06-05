// src/types.ts

/** BlogPost model */
export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
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

// Add these types to your existing types.ts file

// NEW: Appointment Types

/** Calendar User model */
export interface CalendarUser {
  id: number;
  username: string;
  business_name: string;
  display_name: string;
  timezone: string;
  booking_window_days: number;
  buffer_minutes: number;
  is_calendar_active: boolean;
  booking_instructions: string;
  created_at: string;
  updated_at: string;
}

/** Appointment Type model */
export interface AppointmentType {
  id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  color: string;
  is_active: boolean;
  requires_payment: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

/** Availability Slot model */
export interface AvailabilitySlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  recurring_pattern: 'none' | 'daily' | 'weekly' | 'monthly';
  recurring_until?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/** Available Slot for booking */
export interface AvailableSlot {
  date: string;
  start_time: string;
  end_time: string;
  appointment_type_id: number;
}

/** Appointment model */
export interface Appointment {
  id: number;
  appointment_type: AppointmentType;
  appointment_type_name: string;
  calendar_user: string;
  calendar_user_name?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  customer_notes?: string;
  admin_notes?: string;
  payment_required: boolean;
  payment_status: 'not_required' | 'pending' | 'paid' | 'refunded';
  payment_amount?: number;
  stripe_payment_intent_id?: string;
  can_be_cancelled: boolean;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  cancelled_at?: string;
}

/** Booking Settings model */
export interface BookingSettings {
  min_notice_hours: number;
  max_bookings_per_day: number;
  booking_page_title: string;
  booking_page_description: string;
  success_message: string;
}

/** Appointment booking request data */
export interface AppointmentBookingData {
  appointment_type_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_notes?: string;
  date: string;
  start_time: string;
}

/** Calendar statistics */
export interface CalendarStats {
  total_appointments: number;
  confirmed_appointments: number;
  pending_appointments: number;
  this_week_appointments: number;
}

/** Calendar user public view */
export interface CalendarUserPublic {
  username: string;
  business_name: string;
  display_name: string;
  timezone: string;
  booking_instructions: string;
  appointment_types: AppointmentType[];
  booking_settings: BookingSettings;
}