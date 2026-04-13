import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitTestimonialMutation } from "../../features/api/apiSlice";
import { SubPageHero } from "../../components/SubPageHero";
import { CheckCircle, Star, Upload, X, AlertCircle } from "lucide-react";

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

const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-[0.65rem] text-red-500 italic mt-1">{msg}</p> : null;

export default function SubmitTestimonial() {
    const navigate = useNavigate();
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
        if (touched) {
            setErrors(validate(updated, rating));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            const errorMessage = (error as { data?: { error?: string } })?.data?.error || "Something went wrong. Please try again.";
            setErrors({ submit: errorMessage });
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-millions-light">
                <SubPageHero
                    label="Success"
                    title="Thank You!"
                    subText="Your testimonial has been successfully submitted and is pending review by our team."
                />
                <div className="max-w-3xl mx-auto px-4 py-20">
                    <div className="bg-white/60 backdrop-blur-sm border-l-4 border-l-millions-accent p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-center animate-fade-in-up">
                        <CheckCircle className="w-16 h-16 text-millions-accent mx-auto mb-6" />
                        <h3 className="font-cormorant text-[clamp(1.8rem,3vw,2.5rem)] text-millions-dark font-light mb-4">Submission Received</h3>
                        <p className="text-millions-body font-light text-[0.95rem] mb-10">
                            We appreciate you taking the time to share your experience with The Millions. 
                            Your feedback helps us grow and inspires others.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-millions-dark text-white px-10 py-4 font-jost text-[0.78rem] tracking-[0.12em] uppercase font-medium transition-all hover:bg-millions-accent hover:text-millions-dark mx-auto block"
                        >
                            Return to Homepage
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-millions-light">
            <SubPageHero
                label="Share Your Experience"
                title="Your Success is Our Story"
                subText="Help us inspire others by sharing how The Millions has impacted your business or property investment journey."
            />

            <div className="max-w-7xl mx-auto px-4 md:px-20 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-10">
                            <h2 className="font-cormorant text-millions-dark text-3xl font-light mb-4">Testimonial Details</h2>
                            <p className="text-millions-body font-light text-sm italic">
                                Fields marked with an asterisk (*) are required.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="space-y-10 animate-fade-in-up bg-white/60 backdrop-blur-sm p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-millions-dark/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Full Name *</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-white border ${errors.name ? 'border-red-400' : 'border-millions-dark/10'} p-3 text-sm focus:border-millions-accent outline-none font-jost`}
                                        placeholder="e.g. John Doe"
                                        maxLength={100}
                                        required
                                    />
                                    <ErrorMsg msg={errors.name} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Email Address *</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-white border ${errors.email ? 'border-red-400' : 'border-millions-dark/10'} p-3 text-sm focus:border-millions-accent outline-none font-jost`}
                                        placeholder="e.g. john@example.com"
                                        required
                                    />
                                    <ErrorMsg msg={errors.email} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="company" className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Company Name *</label>
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        value={formData.company}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-white border ${errors.company ? 'border-red-400' : 'border-millions-dark/10'} p-3 text-sm focus:border-millions-accent outline-none font-jost`}
                                        placeholder="e.g. Acme Corp"
                                        maxLength={100}
                                        required
                                    />
                                    <ErrorMsg msg={errors.company} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="role" className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Your Role/Title *</label>
                                    <input
                                        id="role"
                                        name="role"
                                        type="text"
                                        value={formData.role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-white border ${errors.role ? 'border-red-400' : 'border-millions-dark/10'} p-3 text-sm focus:border-millions-accent outline-none font-jost`}
                                        placeholder="e.g. CEO & Founder"
                                        maxLength={100}
                                        required
                                    />
                                    <ErrorMsg msg={errors.role} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="location" className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Location *</label>
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-white border ${errors.location ? 'border-red-400' : 'border-millions-dark/10'} p-3 text-sm focus:border-millions-accent outline-none font-jost`}
                                        placeholder="e.g. London, UK"
                                        maxLength={100}
                                        required
                                    />
                                    <ErrorMsg msg={errors.location} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="category" className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Service Category *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-white border ${errors.category ? 'border-red-400' : 'border-millions-dark/10'} p-3 text-sm focus:border-millions-accent outline-none font-jost appearance-none`}
                                        required
                                    >
                                        <option value="" disabled>Select service</option>
                                        <option value="Property Accounting">Property Accounting</option>
                                        <option value="Business Advisory">Business Advisory</option>
                                        <option value="Self Assessment">Self Assessment</option>
                                        <option value="Payroll & Bookkeeping">Payroll & Bookkeeping</option>
                                        <option value="Corporate Tax">Corporate Tax</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ErrorMsg msg={errors.category} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Overall Rating *</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => {
                                                setRating(star);
                                                if (touched) setErrors((prev) => ({ ...prev, rating: '' }));
                                            }}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${rating >= star ? 'fill-millions-accent text-millions-accent' : 'text-millions-dark/10'}`}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <ErrorMsg msg={errors.rating} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="results" className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Concrete Results Achieved *</label>
                                <input
                                    id="results"
                                    name="results"
                                    type="text"
                                    value={formData.results}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`bg-white border ${errors.results ? 'border-red-400' : 'border-millions-dark/10'} p-3 text-sm focus:border-millions-accent outline-none font-jost`}
                                    placeholder="e.g. £15,000+ tax savings"
                                    maxLength={100}
                                    required
                                />
                                <ErrorMsg msg={errors.results} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-baseline">
                                    <label htmlFor="content" className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">Your Testimonial *</label>
                                    <span className={`text-[0.6rem] ${formData.content.trim().length > 1000 ? 'text-red-500' : 'text-millions-muted'}`}>
                                        {formData.content.trim().length}/1000
                                    </span>
                                </div>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={6}
                                    value={formData.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`bg-white border ${errors.content ? 'border-red-400' : 'border-millions-dark/10'} p-3 text-sm focus:border-millions-accent outline-none font-jost resize-none`}
                                    placeholder="Tell us about your experience working with The Millions..."
                                    maxLength={1000}
                                    required
                                />
                                <ErrorMsg msg={errors.content} />
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-[0.65rem] tracking-[0.2em] uppercase text-millions-accent">
                                    Profile Photo <span className="text-millions-muted italic font-light lowercase">(Optional)</span>
                                </label>
                                {imagePreview ? (
                                    <div className="flex items-center gap-6 bg-white p-4 border border-millions-dark/5">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-20 h-20 rounded-none object-cover border border-millions-dark/10 aspect-square shrink-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="text-[0.6rem] tracking-widest uppercase text-red-500 flex items-center gap-2 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-3 h-3" /> Remove Photo
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="image-upload"
                                        className={`flex flex-col items-center justify-center gap-4 w-full py-10 border-2 border-dashed ${errors.image ? 'border-red-400 bg-red-50/20' : 'border-millions-dark/10'} cursor-pointer hover:border-millions-accent hover:bg-white/50 transition-all text-millions-muted`}
                                    >
                                        <Upload className="w-6 h-6 text-millions-accent" />
                                        <span className="text-[0.7rem] tracking-wide font-light">Click to upload (JPG, PNG, WebP — max 2MB)</span>
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

                            {errors.submit && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 animate-fade-in">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <p className="text-red-700 text-sm font-jost">{errors.submit}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-millions-dark text-white px-10 py-4 font-jost text-[0.78rem] tracking-[0.12em] uppercase font-medium transition-all hover:bg-millions-accent hover:text-millions-dark hover:-translate-y-0.5 flex items-center gap-3 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                {isLoading ? "Submitting..." : "Submit Testimonial"}
                            </button>
                        </form>
                    </div>

                    {/* Sidebar / Info Section */}
                    <div className="space-y-10 animate-fade-in-up md:animation-delay-300">
                        <div className="bg-millions-dark p-10 border-t-2 border-t-millions-accent">
                            <h3 className="font-cormorant text-white text-xl font-light mb-6">Why Share?</h3>
                            <p className="text-white/70 text-sm font-light leading-relaxed mb-6">
                                Your journey helps others understand the value of professional advisory and financial management in the property and business sectors.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Inspire fellow entrepreneurs",
                                    "Help us improve our services",
                                    "Build credibility for your brand",
                                    "Join our community of success"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[0.75rem] text-white/50 font-light italic">
                                        <span className="w-1.5 h-1.5 rounded-full bg-millions-accent"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm p-10 border border-millions-dark/5 border-t-2 border-t-millions-mid shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                            <h3 className="font-cormorant text-millions-dark text-[1.4rem] font-light mb-4">Guidelines</h3>
                            <div className="space-y-4 text-millions-body text-[0.85rem] font-light leading-relaxed">
                                <p>Be as specific as possible about the results you've achieved.</p>
                                <p>Mention specific services like <span className="text-millions-dark font-medium italic">Property Accounting</span> or <span className="text-millions-dark font-medium italic">Business Advisory</span>.</p>
                                <p>We value honesty and detailed feedback above all else.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
