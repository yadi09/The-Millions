// Authoritative list of features the firm owners will be asked to rate.
// Both the walkthrough form and the admin results dashboard read from this
// catalogue, so renaming a label propagates everywhere without re-keying
// stored responses (responses are keyed by the stable `id` field).

export type Feature = {
    id: string;
    label: string;
    /** Brief description / "how to find it" hint */
    where: string;
};

export type FeatureCategory = {
    id: string;
    label: string;
    desc: string;
    features: Feature[];
};

export type ResponseStatus = "worked" | "struggled" | "broken" | "skipped";

export const STATUS_OPTIONS: { value: ResponseStatus; label: string; short: string; tone: "success" | "warn" | "error" | "muted" }[] = [
    { value: "worked", label: "Used it without issues", short: "Worked", tone: "success" },
    { value: "struggled", label: "Used it but found it confusing", short: "Confusing", tone: "warn" },
    { value: "broken", label: "Tried but couldn't get it to work", short: "Broken", tone: "error" },
    { value: "skipped", label: "Haven't tried yet", short: "Skipped", tone: "muted" },
];

export const FEATURE_CATALOGUE: FeatureCategory[] = [
    {
        id: "account",
        label: "Account & Login",
        desc: "Signing in and managing your credentials",
        features: [
            { id: "login", label: "Log into the admin", where: "/admin/login" },
            { id: "change-password", label: "Change your password", where: "Settings → Change Password" },
            { id: "change-email", label: "Change your login email", where: "Settings → Change Email" },
        ],
    },
    {
        id: "site-content",
        label: "Site Content",
        desc: "Editing what visitors see on your website",
        features: [
            { id: "edit-home-inline", label: "Edit the Home page content inline", where: "Visit / while logged in — click any section to edit" },
            { id: "edit-footer", label: "Update the footer (contact info, copyright)", where: "Footer editor in admin" },
            { id: "page-visibility", label: "Turn an entire page on or off", where: "Site Visibility → toggle next to each page" },
            { id: "section-visibility", label: "Turn individual Home sections on or off", where: "Site Visibility → expand Home → toggle each section" },
        ],
    },
    {
        id: "maintenance",
        label: "Maintenance Mode",
        desc: "Site-wide kill switch for content rewrites",
        features: [
            { id: "maintenance-toggle", label: "Put the site into 'Coming Soon' mode", where: "Site Visibility → top card 'Maintenance mode'" },
            { id: "maintenance-preview", label: "Preview your changes while maintenance is on", where: "Append ?preview=1 to any URL while logged in" },
        ],
    },
    {
        id: "blog",
        label: "Blog",
        desc: "Publishing articles for your audience",
        features: [
            { id: "blog-create", label: "Create a new blog post", where: "Blog → New Post" },
            { id: "blog-edit", label: "Edit, publish, or delete a post", where: "Blog → click any post" },
            { id: "blog-images", label: "Upload images into a blog post", where: "Blog editor → image button in toolbar" },
        ],
    },
    {
        id: "testimonials",
        label: "Testimonials",
        desc: "Collecting and managing client praise",
        features: [
            { id: "testimonial-moderate", label: "Approve, reject, or feature client testimonials", where: "Testimonials" },
            { id: "testimonial-share-link", label: "Get a shareable link clients use to submit a testimonial", where: "Testimonials → 'Share link' card at top" },
            { id: "testimonial-to-post", label: "Turn an approved testimonial into a LinkedIn post", where: "Testimonials → Live → 'Create Post' on any card" },
        ],
    },
    {
        id: "inbox",
        label: "Contact Inbox",
        desc: "Incoming leads and enquiries",
        features: [
            { id: "inbox-read", label: "Read incoming contact messages", where: "Contact Inbox" },
            { id: "inbox-filter", label: "Filter and search messages", where: "Contact Inbox → source / status filters + search box" },
        ],
    },
    {
        id: "services",
        label: "Services",
        desc: "What the firm offers (drives the contact form's category dropdown)",
        features: [
            { id: "services-crud", label: "Add, edit, or remove a service domain", where: "Services" },
        ],
    },
    {
        id: "brand",
        label: "Brand Tools",
        desc: "Logo, business card, vCard exports",
        features: [
            { id: "brand-logo", label: "Download the firm's logo (mark + wordmark)", where: "Brand Assets" },
            { id: "card-edit", label: "Fill in your business card details", where: "Business Card" },
            { id: "card-pdf", label: "Export your business card as a print-ready PDF", where: "Business Card → Print PDF" },
            { id: "card-vcard", label: "Download a .vcf file of your card (for email signatures)", where: "Business Card → vCard" },
        ],
    },
    {
        id: "social",
        label: "Social Media Posts",
        desc: "Branded graphics for LinkedIn, Instagram, Stories",
        features: [
            { id: "social-tip-list", label: "Create a Tip List post (e.g. '3 ways to cut your tax bill')", where: "Social Posts → Tip List template" },
            { id: "social-quote", label: "Create a Quote post from a testimonial", where: "Social Posts → Quote → 'Use a client testimonial'" },
            { id: "social-stat", label: "Create a Stat post (big number + caption)", where: "Social Posts → Stat template" },
            { id: "social-save", label: "Save a draft to your library and re-open it later", where: "Social Posts → Save Draft → Library panel on the right" },
        ],
    },
    {
        id: "overall",
        label: "Overall experience",
        desc: "How the admin feels to use day-to-day",
        features: [
            { id: "overall-fast", label: "The admin loads quickly enough", where: "" },
            { id: "overall-pro", label: "The admin looks professional and on-brand", where: "" },
            { id: "overall-find", label: "I can find features easily in the sidebar", where: "" },
            { id: "overall-mobile", label: "The admin works well on my phone", where: "" },
        ],
    },
];

// Total count for the progress indicator.
export const TOTAL_FEATURES = FEATURE_CATALOGUE.reduce((n, c) => n + c.features.length, 0);

// Look up a feature by id (used by the admin results page to render labels
// for stored responses).
export function findFeature(id: string): { feature: Feature; category: FeatureCategory } | null {
    for (const category of FEATURE_CATALOGUE) {
        const feature = category.features.find((f) => f.id === id);
        if (feature) return { feature, category };
    }
    return null;
}
