export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    image: string;
    rating: number;
    category: string;
    content: string;
    results: string;
    location: string;
    videoTestimonial: boolean;
    status: TestimonialStatus;
    submittedAt: string;
}

export interface TestimonialLink {
    id: string;
    token: string;
    recipientName: string;
    recipientEmail: string;
    createdAt: string;
    used: boolean;
    expiresAt: string;
}
