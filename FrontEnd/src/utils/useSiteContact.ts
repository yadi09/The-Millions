import { useGetFooterQuery } from "../features/api/apiSlice";
import { landingContent } from "../data/landingContent";

export type SiteContact = {
    phones: string[];
    email: string;
    website: string;
    address: string[];
    whatsapp: string;
};

// Live contact settings from the CMS (/api/footer), falling back to the
// build-time snapshot while the request is in flight or if it fails.
// RTK Query dedupes the request, so every caller shares one fetch.
export function useSiteContact(): SiteContact {
    const { data } = useGetFooterQuery();
    const c = (data?.contact || landingContent.contact) as Partial<SiteContact>;
    return {
        phones: Array.isArray(c.phones) ? c.phones : [],
        email: c.email ?? "",
        website: c.website ?? "",
        address: Array.isArray(c.address) ? c.address : [],
        whatsapp: (c.whatsapp ?? "").trim(),
    };
}
