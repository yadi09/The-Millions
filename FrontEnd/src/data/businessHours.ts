// Single source for opening hours — used by the contact page's "Call Us"
// note and Business Hours table (and later the home-page structured data).
//
// TODO(owner): confirm these hours. The contact page used to say
// "Mon–Fri 9AM–6PM" under Call Us while the table also listed Saturday
// 10AM–2PM. The table was kept as the default until the owner confirms.

export type BusinessHoursRow = {
    /** Label shown in the table. */
    day: string;
    /** schema.org day names this row covers (for structured data). */
    days: string[];
    /** 24h "HH:MM", or null when closed. */
    opens: string | null;
    closes: string | null;
};

export const BUSINESS_HOURS: BusinessHoursRow[] = [
    { day: "Mon – Fri", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { day: "Saturday", days: ["Saturday"], opens: "10:00", closes: "14:00" },
    { day: "Sunday", days: ["Sunday"], opens: null, closes: null },
];

/** "09:00" → "9:00 AM" */
export function to12h(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function hoursLabel(row: BusinessHoursRow): string {
    return row.opens && row.closes ? `${to12h(row.opens)} – ${to12h(row.closes)}` : "Closed";
}

/** Compact one-liner, e.g. "Mon – Fri 9:00 AM – 6:00 PM · Saturday 10:00 AM – 2:00 PM" */
export function openHoursSummary(): string {
    return BUSINESS_HOURS.filter((r) => r.opens)
        .map((r) => `${r.day} ${hoursLabel(r)}`)
        .join(" · ");
}
