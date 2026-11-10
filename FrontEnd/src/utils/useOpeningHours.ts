import { useGetOpeningHoursQuery } from "../features/api/apiSlice";
import { DEFAULT_OPENING_HOURS, type OpeningHours } from "../data/businessHours";

/** Live opening hours from the CMS, with the defaults while loading or on error. */
export function useOpeningHours(): OpeningHours {
    const { data } = useGetOpeningHoursQuery();
    return data ?? DEFAULT_OPENING_HOURS;
}
