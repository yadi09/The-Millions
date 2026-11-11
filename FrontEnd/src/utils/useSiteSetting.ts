import { useGetSiteSettingQuery } from "../features/api/apiSlice";
import { EMPTY_LEGAL_DETAILS, type LegalDetails, type LegalPageContent } from "../data/siteSettings";

export function useLegalDetails(): LegalDetails {
    const { data } = useGetSiteSettingQuery("legal-details");
    return { ...EMPTY_LEGAL_DETAILS, ...((data as Partial<LegalDetails>) ?? {}) };
}

export function useLegalPage(key: "privacy-page" | "cookies-page" | "terms-page") {
    const { data, isLoading, isError } = useGetSiteSettingQuery(key);
    return { page: data as LegalPageContent | undefined, isLoading, isError };
}
