// src/lib/api.ts
import type {
  BlogPost,
  Page,
  LinkHub,
  Testimonial,
  Course,
  CourseEnrollment,
  LessonProgress,
  AppointmentType,
  BookingSettings,
  AvailableSlot,
  Appointment,
  AvailabilitySlot,
  CourseLesson,
  CalendarUser
} from "../types";

const API = "https://corrison.corrisonapi.com";

async function check<T>(res: Response, what: string): Promise<T> {
  if (!res.ok) throw new Error(`Failed to fetch ${what}`);
  return res.json();
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
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

/** NEW: Courses API */
export function fetchCourses(): Promise<Course[]> {
  return fetch(`${API}/api/v1/courses/`).then(r => check<Course[]>(r, "courses"));
}

export function fetchCourse(slug: string): Promise<Course> {
  return fetch(`${API}/api/v1/courses/${slug}/`).then(r => check<Course>(r, "course"));
}

export function fetchUserCourses(): Promise<CourseEnrollment[]> {
  return fetch(`${API}/api/v1/courses/my_courses/`, {
    headers: getAuthHeaders(),
  }).then(r => check<CourseEnrollment[]>(r, "user courses"));
}

export function enrollInCourse(courseId: number): Promise<CourseEnrollment> {
  return fetch(`${API}/api/v1/courses/${courseId}/enroll/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).then(r => check<CourseEnrollment>(r, "course enrollment"));
}

export function fetchLessonProgress(enrollmentId: number): Promise<LessonProgress[]> {
  return fetch(`${API}/api/v1/courses/enrollments/${enrollmentId}/progress/`, {
    headers: getAuthHeaders(),
  }).then(r => check<LessonProgress[]>(r, "lesson progress"));
}

export function updateLessonProgress(lessonId: number, completed: boolean): Promise<LessonProgress> {
  return fetch(`${API}/api/v1/courses/lessons/${lessonId}/progress/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ completed }),
  }).then(r => check<LessonProgress>(r, "lesson progress update"));
}

export async function fetchCourseLessons(courseSlug: string): Promise<CourseLesson[]> {
  const response = await fetch(`${API}/api/v1/courses/${courseSlug}/lessons/`);
  if (!response.ok) throw new Error(`Failed to fetch lessons for course ${courseSlug}`);
  return response.json();
}

/** NEW: Saved Courses API */
export function saveCourse(courseSlug: string): Promise<{ message: string; saved: boolean }> {
  return fetch(`${API}/api/v1/courses/${courseSlug}/save_course/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).then(r => check(r, "save course"));
}

export function unsaveCourse(courseSlug: string): Promise<{ message: string; saved: boolean }> {
  return fetch(`${API}/api/v1/courses/${courseSlug}/unsave_course/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then(r => check(r, "unsave course"));
}

export function fetchSavedCourses(): Promise<{ id: number; course: Course; created_at: string }[]> {
  return fetch(`${API}/api/v1/courses/my_saved/`, {
    headers: getAuthHeaders(),
  }).then(r => check(r, "saved courses"));
}

/** Helper function to toggle save state */
export async function toggleCourseSave(courseSlug: string, currentlySaved: boolean): Promise<boolean> {
  try {
    const result = currentlySaved
      ? await unsaveCourse(courseSlug)
      : await saveCourse(courseSlug);
    return result.saved;
  } catch (error) {
    console.error('Error toggling course save:', error);
    throw error;
  }
}

/** NEW: Appointments API - Public endpoints */
export function fetchCalendarUser(username: string): Promise<{
  username: string;
  business_name: string;
  display_name: string;
  timezone: string;
  booking_instructions: string;
  appointment_types: AppointmentType[];
  booking_settings: BookingSettings;
}> {
  return fetch(`${API}/api/v1/appointments-booking/api/public/${username}/`)
    .then(r => check(r, "calendar user"));
}

export function fetchAvailableSlots(
  username: string,
  appointmentTypeId: number,
  startDate?: string,
  endDate?: string
): Promise<AvailableSlot[]> {
  const params = new URLSearchParams({
    appointment_type_id: appointmentTypeId.toString(),
    ...(startDate && { start_date: startDate }),
    ...(endDate && { end_date: endDate })
  });

  return fetch(`${API}/api/v1/appointments-booking/api/public/${username}/slots/?${params}`)
    .then(r => check<AvailableSlot[]>(r, "available slots"));
}

export function bookAppointment(bookingData: {
  appointment_type_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_notes?: string;
  date: string;
  start_time: string;
}): Promise<{
  id: number;
  status: string;
  payment_required: boolean;
  payment_amount?: number;
  customer_name: string;
  customer_email: string;
  date: string;
  start_time: string;
  end_time: string;
}> {
  return fetch(`${API}/api/v1/appointments-booking/api/public/book/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  }).then(r => check(r, "appointment booking"));
}

export function fetchCustomerAppointment(appointmentId: number, email: string): Promise<{
  id: number;
  appointment_type_name: string;
  calendar_user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: string;
  customer_notes?: string;
  payment_status: string;
  payment_amount?: number;
  can_be_cancelled: boolean;
  created_at: string;
  confirmed_at?: string;
}> {
  return fetch(`${API}/api/v1/appointments-booking/api/public/appointment/${appointmentId}/?email=${encodeURIComponent(email)}`)
    .then(r => check(r, "customer appointment"));
}

export function cancelCustomerAppointment(appointmentId: number, email: string): Promise<{
  id: number;
  status: string;
  cancelled_at: string;
}> {
  return fetch(`${API}/api/v1/appointments-booking/api/public/appointment/${appointmentId}/cancel/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then(r => check(r, "appointment cancellation"));
}

/** NEW: Appointments API - Authenticated endpoints */
export function fetchUserAppointments(): Promise<Appointment[]> {
  return fetch(`${API}/api/v1/appointments/appointments/`, {
    headers: getAuthHeaders(),
  }).then(r => check<Appointment[]>(r, "user appointments"));
}

export function fetchUserAppointment(appointmentId: number): Promise<Appointment> {
  return fetch(`${API}/api/v1/appointments/appointments/${appointmentId}/`, {
    headers: getAuthHeaders(),
  }).then(r => check<Appointment>(r, "user appointment"));
}

export function cancelUserAppointment(appointmentId: number): Promise<Appointment> {
  return fetch(`${API}/api/v1/appointments/appointments/${appointmentId}/cancel/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).then(r => check<Appointment>(r, "appointment cancellation"));
}

export function confirmAppointment(appointmentId: number): Promise<Appointment> {
  return fetch(`${API}/api/v1/appointments/appointments/${appointmentId}/confirm/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).then(r => check<Appointment>(r, "appointment confirmation"));
}

/** NEW: Calendar User Management (authenticated) */
export function fetchUserCalendarProfile(): Promise<{
  id: number;
  username: string;
  business_name: string;
  display_name: string;
  timezone: string;
  booking_window_days: number;
  buffer_minutes: number;
  is_calendar_active: boolean;
  booking_instructions: string;
}> {
  return fetch(`${API}/api/v1/appointments/profiles/`, {
    headers: getAuthHeaders(),
  }).then(r => check(r, "calendar profile"));
}

export function updateCalendarProfile(profileData: {
  business_name?: string;
  timezone?: string;
  booking_window_days?: number;
  buffer_minutes?: number;
  is_calendar_active?: boolean;
  booking_instructions?: string;
}): Promise<any> {
  return fetch(`${API}/api/v1/appointments/profiles/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  }).then(r => check(r, "calendar profile update"));
}

export function fetchAppointmentTypes(): Promise<AppointmentType[]> {
  return fetch(`${API}/api/v1/appointments/appointment-types/`, {
    headers: getAuthHeaders(),
  }).then(r => check<AppointmentType[]>(r, "appointment types"));
}

export function createAppointmentType(typeData: {
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  color?: string;
  requires_payment?: boolean;
  order?: number;
}): Promise<AppointmentType> {
  return fetch(`${API}/api/v1/appointments/appointment-types/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(typeData),
  }).then(r => check<AppointmentType>(r, "appointment type creation"));
}

export function updateAppointmentType(typeId: number, typeData: Partial<AppointmentType>): Promise<AppointmentType> {
  return fetch(`${API}/api/v1/appointments/appointment-types/${typeId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(typeData),
  }).then(r => check<AppointmentType>(r, "appointment type update"));
}

export function deleteAppointmentType(typeId: number): Promise<void> {
  return fetch(`${API}/api/v1/appointments/appointment-types/${typeId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then(r => {
    if (!r.ok) throw new Error('Failed to delete appointment type');
  });
}

export function fetchAvailability(): Promise<AvailabilitySlot[]> {
  return fetch(`${API}/api/v1/appointments/availability/`, {
    headers: getAuthHeaders(),
  }).then(r => check<AvailabilitySlot[]>(r, "availability slots"));
}

export function createAvailability(availabilityData: {
  date: string;
  start_time: string;
  end_time: string;
  is_available?: boolean;
  recurring_pattern?: string;
  recurring_until?: string;
  notes?: string;
}): Promise<AvailabilitySlot> {
  return fetch(`${API}/api/v1/appointments/availability/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(availabilityData),
  }).then(r => check<AvailabilitySlot>(r, "availability creation"));
}

export function updateAvailability(availabilityId: number, availabilityData: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> {
  return fetch(`${API}/api/v1/appointments/availability/${availabilityId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(availabilityData),
  }).then(r => check<AvailabilitySlot>(r, "availability update"));
}

export function deleteAvailability(availabilityId: number): Promise<void> {
  return fetch(`${API}/api/v1/appointments/availability/${availabilityId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then(r => {
    if (!r.ok) throw new Error('Failed to delete availability slot');
  });
}

/** NEW: Fetch available calendar users */
export function fetchAvailableCalendars(): Promise<{
  username: string;
  display_name: string;
  business_name: string;
}[]> {
  return fetch(`${API}/api/v1/appointments-booking/api/public/available/`)
    .then(r => check(r, "available calendars"));
}