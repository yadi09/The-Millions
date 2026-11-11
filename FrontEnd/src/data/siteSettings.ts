// Admin-editable settings served by GET /api/settings/:key (see the backend's
// site-settings.schemas.ts for validation and defaults).

export type LegalDetails = {
    companyName: string;
    companyNumber: string;
    registeredIn: string;
    registeredOffice: string;
    accaStatement: string;
    charityName: string;
    charityNumber: string;
};

export type LegalSection = { heading: string; body: string };
export type LegalPageContent = { lastUpdated: string; intro: string; sections: LegalSection[] };

export type SiteSettingKey = "legal-details" | "privacy-page" | "cookies-page" | "terms-page";

export const EMPTY_LEGAL_DETAILS: LegalDetails = {
    companyName: "",
    companyNumber: "",
    registeredIn: "",
    registeredOffice: "",
    accaStatement: "",
    charityName: "",
    charityNumber: "",
};
