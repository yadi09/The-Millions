import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, CheckCircle, AlertTriangle, Send, Quote } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useTestimonials } from '../../context/TestimonialContext';

const categories = [
    'Property Accounting',
    'Business Advisory',
    'Self Assessment',
    'Payroll & Bookkeeping',
    'VAT Returns',
    'Tax Planning',
    'Company Formation',
    'Other',
];

export default function SubmitTestimonial() {
    const { token } = useParams<{ token: string }>();
    const { links, dispatch } = useTestimonials();

    // Derive link validity on every render — NOT stored in state
    const linkInfo = token
        ? links.find(
            (l) => l.token === token && !l.used && new Date(l.expiresAt) > new Date()
        ) ?? null
        : null;

    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [form, setForm] = useState({
        name: '',
        role: '',
        company: '',
        category: categories[0],
        content: '',
        results: '',
        location: '',
    });

    // Pre-fill name from link info if available and name is still empty
    if (linkInfo && !form.name && linkInfo.recipientName) {
        setForm((prev) => ({ ...prev, name: linkInfo.recipientName }));
    }

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const canSubmit =
        form.name.trim() &&
        form.role.trim() &&
        form.company.trim() &&
        form.content.trim().length >= 20;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit || !token) return;

        dispatch({
            type: 'SUBMIT_TESTIMONIAL',
            payload: {
                token,
                testimonial: {
                    id: `t-${Date.now()}`,
                    name: form.name,
                    role: form.role,
                    company: form.company,
                    category: form.category,
                    content: form.content,
                    results: form.results || 'Shared their experience',
                    location: form.location || 'UK',
                    rating,
                    image: '/placeholder.svg?height=60&width=60',
                    videoTestimonial: false,
                    status: 'pending',
                    submittedAt: new Date().toISOString(),
                },
            },
        });

        setSubmitted(true);
    };

    // ── Invalid / Expired Token ──────────────────────────────────────────
    if (!linkInfo && !submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-0 shadow-2xl">
                    <CardContent className="pt-10 pb-10 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-amber-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-3">
                            Invalid or Expired Link
                        </h1>
                        <p className="text-slate-500 leading-relaxed">
                            This testimonial link is no longer valid. It may have already been
                            used or has expired. Please contact the administrator for a new
                            link.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ── Success State ────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-0 shadow-2xl animate-in fade-in duration-500">
                    <CardContent className="pt-10 pb-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-3">
                            Thank You!
                        </h1>
                        <p className="text-slate-500 leading-relaxed mb-2">
                            Your testimonial has been submitted successfully and is now
                            pending review.
                        </p>
                        <p className="text-sm text-slate-400">
                            We appreciate you taking the time to share your experience with
                            The Millions.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ── Main Form ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 px-4">
            {/* Branding Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Quote className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        The Millions
                    </h1>
                </div>
                <p className="text-blue-200/70 max-w-md mx-auto">
                    We'd love to hear about your experience. Your feedback helps us serve
                    our clients better.
                </p>
            </div>

            <Card className="max-w-2xl mx-auto border-0 shadow-2xl">
                <CardContent className="p-8 md:p-10">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                            Share Your Experience
                        </h2>
                        <p className="text-sm text-slate-500">
                            Fields marked with <span className="text-red-500">*</span> are
                            required
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Role */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="testimonial-name"
                                    value={form.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="e.g. Sarah Johnson"
                                    className="h-11"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Role / Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="testimonial-role"
                                    value={form.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    placeholder="e.g. Property Investor"
                                    className="h-11"
                                />
                            </div>
                        </div>

                        {/* Company & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="testimonial-company"
                                    value={form.company}
                                    onChange={(e) => handleChange('company', e.target.value)}
                                    placeholder="e.g. Johnson Properties Ltd"
                                    className="h-11"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Service Category
                                </label>
                                <select
                                    id="testimonial-category"
                                    value={form.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Your Rating
                            </label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-0.5 transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-7 h-7 transition-colors ${star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'fill-slate-200 text-slate-200'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-slate-500">
                                    {rating} / 5
                                </span>
                            </div>
                        </div>

                        {/* Testimonial Content */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Your Testimonial <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="testimonial-content"
                                value={form.content}
                                onChange={(e) => handleChange('content', e.target.value)}
                                placeholder="Tell us about your experience working with The Millions. How did we help your business?"
                                rows={5}
                                className="resize-none"
                            />
                            <p className="mt-1 text-xs text-slate-400">
                                Minimum 20 characters ({form.content.length}/20)
                            </p>
                        </div>

                        {/* Results & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Key Result / Highlight
                                </label>
                                <Input
                                    id="testimonial-results"
                                    value={form.results}
                                    onChange={(e) => handleChange('results', e.target.value)}
                                    placeholder="e.g. £15,000+ tax savings"
                                    className="h-11"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Location
                                </label>
                                <Input
                                    id="testimonial-location"
                                    value={form.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="e.g. London, UK"
                                    className="h-11"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25 transition-all duration-300"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Submit Testimonial
                        </Button>

                        <p className="text-center text-xs text-slate-400">
                            Your testimonial will be reviewed before being published on our
                            website.
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
