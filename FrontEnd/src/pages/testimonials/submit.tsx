import { useState } from "react";
import { useSubmitTestimonialMutation } from "../../features/api/apiSlice";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { CheckCircle2, Loader2, Star, Upload, X } from "lucide-react";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormErrors = {
    [key: string]: string;
};

function validate(formData: Record<string, string>, rating: number): FormErrors {
    const errors: FormErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const company = formData.company.trim();
    const role = formData.role.trim();
    const location = formData.location.trim();
    const category = formData.category;
    const results = formData.results.trim();
    const content = formData.content.trim();

    if (!name) errors.name = "Full name is required.";
    else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
    else if (name.length > 100) errors.name = "Name must be under 100 characters.";

    if (!email) errors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email)) errors.email = "Please enter a valid email address.";

    if (!company) errors.company = "Company name is required.";
    else if (company.length < 2) errors.company = "Company must be at least 2 characters.";
    else if (company.length > 100) errors.company = "Company must be under 100 characters.";

    if (!role) errors.role = "Your role/title is required.";
    else if (role.length < 2) errors.role = "Role must be at least 2 characters.";
    else if (role.length > 100) errors.role = "Role must be under 100 characters.";

    if (!location) errors.location = "Location is required.";
    else if (location.length < 2) errors.location = "Location must be at least 2 characters.";
    else if (location.length > 100) errors.location = "Location must be under 100 characters.";

    if (!category) errors.category = "Please select a service category.";

    if (rating < 1 || rating > 5) errors.rating = "Please select a rating between 1 and 5.";

    if (!results) errors.results = "Results are required.";
    else if (results.length > 100) errors.results = "Results must be under 100 characters.";

    if (!content) errors.content = "Your testimonial is required.";
    else if (content.length < 20) errors.content = "Testimonial must be at least 20 characters.";
    else if (content.length > 1000) errors.content = "Testimonial must be under 1000 characters.";

    return errors;
}

const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${hasError ? 'border-red-400 bg-red-50/50' : 'border-slate-300'}`;

const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-xs text-red-600 mt-1">{msg}</p> : null;

export default function SubmitTestimonial() {
    const [submitTestimonial, { isLoading, isSuccess }] = useSubmitTestimonialMutation();
    const [rating, setRating] = useState(5);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        company: "",
        category: "",
        content: "",
        results: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const updated = { ...formData, [e.target.name]: e.target.value };
        setFormData(updated);
        // Re-validate on change only if user has already attempted to submit
        if (touched) {
            setErrors(validate(updated, rating));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        // Validate single field on blur for immediate feedback
        const fieldErrors = validate({ ...formData, [e.target.name]: e.target.value }, rating);
        setErrors((prev) => ({ ...prev, [e.target.name]: fieldErrors[e.target.name] || '' }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setErrors((prev) => ({ ...prev, image: "Only JPG, PNG, and WebP images are allowed." }));
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setErrors((prev) => ({ ...prev, image: "Image must be smaller than 2MB." }));
            return;
        }

        setErrors((prev) => ({ ...prev, image: '' }));
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setErrors((prev) => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(true);

        // Trim all values before validation
        const trimmed = Object.fromEntries(
            Object.entries(formData).map(([k, v]) => [k, v.trim()])
        ) as typeof formData;

        const validationErrors = validate(trimmed, rating);
        setErrors(validationErrors);

        if (Object.values(validationErrors).some((v) => v)) return;

        try {
            await submitTestimonial({
                ...trimmed,
                rating,
                image: imagePreview || undefined,
                videoTestimonial: false,
            }).unwrap();
        } catch (error) {
            console.error("Failed to submit testimonial", error);
            setErrors({ submit: "Something went wrong. Please try again." });
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="pt-10 pb-8 px-8">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
                        <p className="text-slate-600 mb-6">
                            Your testimonial has been successfully submitted and is pending review by our team.
                            We appreciate you taking the time to share your experience!
                        </p>
                        <Button onClick={() => window.location.href = '/'} variant="outline">
                            Return to Homepage
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Share Your Experience</h1>
                    <p className="text-slate-600">Help us inspire others by sharing how The Millions has impacted your business.</p>
                </div>

                <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-6">
                        <CardTitle>Testimonial Details</CardTitle>
                        <CardDescription>All fields are required unless marked otherwise.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClass(!!errors.name)}
                                        placeholder="John Doe"
                                        maxLength={100}
                                    />
                                    <ErrorMsg msg={errors.name} />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClass(!!errors.email)}
                                        placeholder="john@example.com"
                                    />
                                    <ErrorMsg msg={errors.email} />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="company" className="text-sm font-medium text-slate-700">Company Name</label>
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        value={formData.company}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClass(!!errors.company)}
                                        placeholder="Acme Corp"
                                        maxLength={100}
                                    />
                                    <ErrorMsg msg={errors.company} />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="role" className="text-sm font-medium text-slate-700">Your Role/Title</label>
                                    <input
                                        id="role"
                                        name="role"
                                        type="text"
                                        value={formData.role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClass(!!errors.role)}
                                        placeholder="CEO & Founder"
                                        maxLength={100}
                                    />
                                    <ErrorMsg msg={errors.role} />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="location" className="text-sm font-medium text-slate-700">Location</label>
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={inputClass(!!errors.location)}
                                        placeholder="London, UK"
                                        maxLength={100}
                                    />
                                    <ErrorMsg msg={errors.location} />
                                </div>
                            </div>

                            {/* Optional Image Upload */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Profile Photo <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                {imagePreview ? (
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 aspect-square shrink-0"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={removeImage}
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4 mr-1" /> Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="image-upload"
                                        className={`flex items-center justify-center gap-2 w-full px-3 py-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-sm text-slate-500 ${errors.image ? 'border-red-400 bg-red-50/50' : 'border-slate-300'}`}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Click to upload a photo (JPG, PNG, WebP — max 2MB)
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                                <ErrorMsg msg={errors.image} />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="category" className="text-sm font-medium text-slate-700">Service Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`${inputClass(!!errors.category)} bg-white`}
                                >
                                    <option value="" disabled>Select the primary service we provided</option>
                                    <option value="Property Accounting">Property Accounting</option>
                                    <option value="Business Advisory">Business Advisory</option>
                                    <option value="Self Assessment">Self Assessment</option>
                                    <option value="Payroll & Bookkeeping">Payroll & Bookkeeping</option>
                                    <option value="Corporate Tax">Corporate Tax</option>
                                    <option value="Other">Other</option>
                                </select>
                                <ErrorMsg msg={errors.category} />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Overall Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => {
                                                setRating(star);
                                                if (touched) setErrors((prev) => ({ ...prev, rating: '' }));
                                            }}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <ErrorMsg msg={errors.rating} />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="results" className="text-sm font-medium text-slate-700">Concrete Results Achieved (Short)</label>
                                <input
                                    id="results"
                                    name="results"
                                    type="text"
                                    value={formData.results}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass(!!errors.results)}
                                    placeholder="e.g. £15,000+ tax savings"
                                    maxLength={100}
                                />
                                <ErrorMsg msg={errors.results} />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <label htmlFor="content" className="text-sm font-medium text-slate-700">Your Testimonial</label>
                                    <span className={`text-xs ${formData.content.trim().length > 1000 ? 'text-red-500' : 'text-slate-400'}`}>
                                        {formData.content.trim().length}/1000
                                    </span>
                                </div>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={5}
                                    value={formData.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`${inputClass(!!errors.content)} resize-none`}
                                    placeholder="Tell us about your experience working with The Millions..."
                                    maxLength={1000}
                                />
                                <ErrorMsg msg={errors.content} />
                            </div>

                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                                    {errors.submit}
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Testimonial"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
