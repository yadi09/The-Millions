import { z } from "zod";
import { sanitizeHtmlContent } from "../../utils/sanitize.js";

// Admin-editable site settings stored in the generic `Setting` table.
// Each key has a zod schema (validated on write) and a default (served
// until an admin saves). Adding a key here is the only backend change
// needed to make a new settings block editable.

const text = (max: number) => z.string().trim().max(max).default("");
// Rich text from the inline editor: sanitised server-side as well as on render.
const richText = (max: number) => z.string().max(max).default("").transform(sanitizeHtmlContent);

// ---- Legal details (footer legal row) --------------------------------------
// TODO(owner): every value is supplied by the owner in the site editor.
// Empty values are hidden on the site, so nothing placeholder-y is published.
export const legalDetailsSchema = z.object({
    companyName: text(120),
    // UK company numbers: 8 digits, or 2 letters + 6 digits (e.g. SC123456).
    companyNumber: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^$|^(\d{8}|[A-Z]{2}\d{6})$/, "Company number must be 8 characters, e.g. 12345678 or SC123456")
        .default(""),
    registeredIn: text(60),
    registeredOffice: text(200),
    accaStatement: text(400),
    charityName: text(120),
    charityNumber: z
        .string()
        .trim()
        .regex(/^$|^[0-9][0-9-]{3,14}$/, "Charity number should be digits, e.g. 1234567")
        .default(""),
});

// ---- Legal pages (/privacy, /cookies, /terms) -------------------------------
const legalSection = z.object({
    heading: z.string().trim().min(1, "Each section needs a heading").max(150),
    body: richText(20_000),
});

export const legalPageSchema = z.object({
    lastUpdated: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").default(""),
    intro: richText(5_000),
    sections: z.array(legalSection).max(30).default([]),
});

const outline = (headings: string[], bodies: Record<number, string> = {}) =>
    headings.map((heading, i) => ({ heading, body: bodies[i] ?? "" }));

// Section bodies are left empty for the owner/legal adviser to supply —
// except plain facts about how this website works, which are pre-filled
// so the owner can confirm them rather than research them.
const DEFAULTS = {
    "legal-details": {
        companyName: "",
        companyNumber: "",
        registeredIn: "",
        registeredOffice: "",
        accaStatement: "",
        charityName: "",
        charityNumber: "",
    },
    "privacy-page": {
        lastUpdated: "",
        intro: "",
        sections: outline(
            [
                "Who we are (data controller)",
                "Information we collect",
                "Information you send through our contact form",
                "How we use your information",
                "Lawful basis for processing",
                "Who we share your information with",
                "How long we keep your information",
                "Your rights",
                "Cookies",
                "Contact us or make a complaint",
            ],
            {
                2: "<p>When you use the contact form we receive your name, email address, phone number (optional), the service you are interested in and your message. These are stored securely in our website's database so our team can respond to your enquiry.</p>",
                8: "<p>See our <a href=\"/cookies\">Cookie Policy</a>.</p>",
            }
        ),
    },
    "cookies-page": {
        lastUpdated: "",
        intro: "",
        sections: outline(
            ["What cookies are", "Cookies this website uses", "Third-party content", "Managing cookies", "Changes to this policy"],
            {
                1: "<p>This website does not set cookies of its own for visitors, and it does not use analytics or advertising cookies.</p>",
                2: "<p>The map on our contact page is provided by Google Maps. It only loads after you click \"Show map\"; once loaded, Google may set its own cookies. Our website fonts are loaded from Google Fonts, which does not set cookies.</p>",
            }
        ),
    },
    "terms-page": {
        lastUpdated: "",
        intro: "",
        sections: outline([
            "About us",
            "Using this website",
            "Information on this website is not advice",
            "Intellectual property",
            "Links to other websites",
            "Limitation of liability",
            "Governing law",
            "Contact us",
        ]),
    },
} as const;

export const SITE_SETTINGS = {
    "legal-details": { schema: legalDetailsSchema, defaults: DEFAULTS["legal-details"] },
    "privacy-page": { schema: legalPageSchema, defaults: DEFAULTS["privacy-page"] },
    "cookies-page": { schema: legalPageSchema, defaults: DEFAULTS["cookies-page"] },
    "terms-page": { schema: legalPageSchema, defaults: DEFAULTS["terms-page"] },
} as const;

export type SiteSettingKey = keyof typeof SITE_SETTINGS;

export function isSiteSettingKey(key: string): key is SiteSettingKey {
    return Object.prototype.hasOwnProperty.call(SITE_SETTINGS, key);
}
