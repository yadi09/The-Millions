// Matches the backend's Prisma enum exactly (uppercase, by convention).
export type TestimonialStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Testimonial {
  id: string;
  name: string;
  email?: string;           // Optional (can be null in DB)
  role: string;
  company: string;
  image?: string;           // Optional
  rating: number;
  category?: string;        // Optional
  content: string;
  results?: string;         // Optional
  videoTestimonial: boolean; //Add this - required (has @default in schema)
  location?: string;        // Optional
  status: TestimonialStatus;
  order: number;
  createdAt: string;
}

export interface SubmitTestimonialRequest {
    name: string;
    email: string;
    role: string;
    company: string;
    rating: number;
    category: string;
    content: string;
    results: string;
    location: string;
    image?: string; // Optional for submitting
    videoTestimonial?: boolean;
}
