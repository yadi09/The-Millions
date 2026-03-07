import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Testimonial, TestimonialLink } from '../types/testimonialTypes';

// ---------------------------------------------------------------------------
// Seed data — the existing hardcoded testimonials, pre‑approved
// ---------------------------------------------------------------------------
const seedTestimonials: Testimonial[] = [
    {
        id: '1', name: 'Sarah Johnson', role: 'Property Investor',
        company: 'Johnson Properties Ltd', image: 'https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922334/pages/home/testimonials/photo_2026-02-24_09-46-45.jpg',
        rating: 5, category: 'Property Accounting',
        content: 'The Millions completely transformed how we manage our property portfolio accounting. Their cloud-based system and proactive tax planning saved us over £15,000 in the first year alone.',
        results: '£15,000+ tax savings', location: 'London, UK',
        videoTestimonial: false, status: 'approved', submittedAt: '2025-11-10T10:00:00Z',
    },
    {
        id: '2', name: 'Marcus Chen', role: 'CEO & Founder',
        company: 'TechStart Solutions', image: 'https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922388/pages/home/testimonials/photo_2026-02-24_09-46-27.jpg',
        rating: 5, category: 'Business Advisory',
        content: "Their business advisory services helped us secure £500K in funding by presenting our financials professionally to investors. They're not just accountants - they're strategic partners.",
        results: '£500K funding secured', location: 'Manchester, UK',
        videoTestimonial: true, status: 'approved', submittedAt: '2025-11-15T10:00:00Z',
    },
    {
        id: '3', name: 'Emma Williams', role: 'Freelance Consultant',
        company: 'Self-Employed', image: 'https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922422/pages/home/testimonials/photo_2026-02-24_09-46-10.jpg',
        rating: 5, category: 'Self Assessment',
        content: 'After years of struggling with self-assessment, finding The Millions was a game-changer. They explained everything in plain English and their fixed-fee approach meant no surprise bills.',
        results: 'Stress-free tax compliance', location: 'Birmingham, UK',
        videoTestimonial: false, status: 'approved', submittedAt: '2025-12-01T10:00:00Z',
    },
    {
        id: '4', name: 'David Thompson', role: 'Restaurant Owner',
        company: 'Taste of Britain Group', image: 'https://res.cloudinary.com/dwuyfw7mf/image/upload/v1771922456/pages/home/testimonials/photo_2026-02-24_09-46-20.jpg',
        rating: 5, category: 'Payroll & Bookkeeping',
        content: 'Managing payroll for 3 restaurant locations was a nightmare before The Millions. They implemented a cloud-based system that handles everything seamlessly.',
        results: '3 locations streamlined', location: 'Leeds, UK',
        videoTestimonial: true, status: 'approved', submittedAt: '2025-12-10T10:00:00Z',
    },
    {
        id: '5', name: 'Rachel Martinez', role: 'E-commerce Director',
        company: 'StyleHub Online', image: '/placeholder.svg?height=60&width=60',
        rating: 5, category: 'VAT Returns',
        content: "The complexity of VAT for our e-commerce business was overwhelming. The Millions not only sorted our VAT returns but also identified areas where we were overpaying.",
        results: '£8,000 VAT recovered', location: 'Bristol, UK',
        videoTestimonial: false, status: 'approved', submittedAt: '2026-01-05T10:00:00Z',
    },
    {
        id: '6', name: 'James & Lisa Parker', role: 'Co-Directors',
        company: 'Parker Family Investments', image: '/placeholder.svg?height=60&width=60',
        rating: 5, category: 'Tax Planning',
        content: 'As a family-owned business, we needed accountants who understood our unique needs. The Millions helped us structure our investments tax-efficiently across generations.',
        results: 'Multi-generational planning', location: 'Edinburgh, UK',
        videoTestimonial: false, status: 'approved', submittedAt: '2026-01-12T10:00:00Z',
    },
    {
        id: '7', name: 'Ahmed Hassan', role: 'Medical Practitioner',
        company: 'Private Practice', image: '/placeholder.svg?height=60&width=60',
        rating: 5, category: 'Self Assessment',
        content: "Running a busy medical practice means I don't have time for paperwork. The Millions handle everything from tax returns to financial planning, giving me peace of mind.",
        results: 'Complete peace of mind', location: 'Glasgow, UK',
        videoTestimonial: true, status: 'approved', submittedAt: '2026-01-20T10:00:00Z',
    },
    {
        id: '8', name: "Catherine O'Brien", role: 'Startup Founder',
        company: 'GreenTech Innovations', image: '/placeholder.svg?height=60&width=60',
        rating: 5, category: 'Company Formation',
        content: "From company formation to R&D tax credits, The Millions guided us through every step. Their expertise in startup accounting is unmatched.",
        results: '£45K R&D tax credits', location: 'Cambridge, UK',
        videoTestimonial: false, status: 'approved', submittedAt: '2026-02-01T10:00:00Z',
    },
];

// Seed one demo link so the admin panel isn't empty
const seedLinks: TestimonialLink[] = [
    {
        id: 'link-1',
        token: 'demo-token-abc123',
        recipientName: 'Demo User',
        recipientEmail: 'demo@example.com',
        createdAt: '2026-02-10T09:00:00Z',
        used: false,
        expiresAt: '2026-03-10T09:00:00Z',
    },
];

// ---------------------------------------------------------------------------
// State & Actions
// ---------------------------------------------------------------------------
interface TestimonialState {
    testimonials: Testimonial[];
    links: TestimonialLink[];
}

type Action =
    | { type: 'ADD_LINK'; payload: TestimonialLink }
    | { type: 'SUBMIT_TESTIMONIAL'; payload: { testimonial: Testimonial; token: string } }
    | { type: 'APPROVE_TESTIMONIAL'; payload: string }
    | { type: 'REJECT_TESTIMONIAL'; payload: string }
    | { type: 'DELETE_TESTIMONIAL'; payload: string };

function reducer(state: TestimonialState, action: Action): TestimonialState {
    switch (action.type) {
        case 'ADD_LINK':
            return { ...state, links: [action.payload, ...state.links] };

        case 'SUBMIT_TESTIMONIAL':
            return {
                ...state,
                testimonials: [action.payload.testimonial, ...state.testimonials],
                links: state.links.map((l) =>
                    l.token === action.payload.token ? { ...l, used: true } : l
                ),
            };

        case 'APPROVE_TESTIMONIAL':
            return {
                ...state,
                testimonials: state.testimonials.map((t) =>
                    t.id === action.payload ? { ...t, status: 'approved' as const } : t
                ),
            };

        case 'REJECT_TESTIMONIAL':
            return {
                ...state,
                testimonials: state.testimonials.map((t) =>
                    t.id === action.payload ? { ...t, status: 'rejected' as const } : t
                ),
            };

        case 'DELETE_TESTIMONIAL':
            return {
                ...state,
                testimonials: state.testimonials.filter((t) => t.id !== action.payload),
            };

        default:
            return state;
    }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface TestimonialContextValue extends TestimonialState {
    dispatch: React.Dispatch<Action>;
}

const TestimonialContext = createContext<TestimonialContextValue | null>(null);

export function TestimonialProvider({ children }: { children: ReactNode }) {
    // Initialize from localStorage or fallback to seeds
    const [state, dispatch] = useReducer(reducer, {
        testimonials: seedTestimonials,
        links: seedLinks,
    }, (initial) => {
        try {
            const stored = localStorage.getItem('testimonial_data');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load testimonials from storage', e);
        }
        return initial;
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem('testimonial_data', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save testimonials to storage', e);
        }
    }, [state]);

    return (
        <TestimonialContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TestimonialContext.Provider>
    );
}

export function useTestimonials() {
    const ctx = useContext(TestimonialContext);
    if (!ctx) throw new Error('useTestimonials must be used inside TestimonialProvider');
    return ctx;
}
