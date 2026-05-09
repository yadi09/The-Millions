export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
    id: string;
    name: string;
    email: string;
    role: string;
    company: string;
    image: string; // URL to avatar
    rating: number; // 1-5
    category: string; // Service category
    content: string;
    results: string;
    videoTestimonial: boolean;
    location: string;
    status: TestimonialStatus;
    order: number; // For manual ordering of featured testimonials, 0 means not featured
    createdAt: string; // ISO date string
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
