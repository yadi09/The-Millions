// Opening hours model shared by the contact page, the inline editor and
// (later) the home-page structured data. The live values are edited by
// admins in the site editor and served from GET /api/opening-hours;
// DEFAULT_OPENING_HOURS is only used until that request resolves.

export const WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export type DayHours = { day: Weekday; closed: boolean; opens?: string; closes?: string };
export type HoursException = { date: string; label: string; closed: boolean; opens?: string; closes?: string };
export type OpeningHours = { weekly: DayHours[]; note: string; exceptions: HoursException[] };

export const DAY_LABEL: Record<Weekday, { short: string; long: string; schema: string }> = {
    monday: { short: "Mon", long: "Monday", schema: "Monday" },
    tuesday: { short: "Tue", long: "Tuesday", schema: "Tuesday" },
    wednesday: { short: "Wed", long: "Wednesday", schema: "Wednesday" },
    thursday: { short: "Thu", long: "Thursday", schema: "Thursday" },
    friday: { short: "Fri", long: "Friday", schema: "Friday" },
    saturday: { short: "Sat", long: "Saturday", schema: "Saturday" },
    sunday: { short: "Sun", long: "Sunday", schema: "Sunday" },
};

export const DEFAULT_OPENING_HOURS: OpeningHours = {
    weekly: WEEKDAYS.map((day): DayHours => {
        if (day === "saturday") return { day, closed: false, opens: "10:00", closes: "14:00" };
        if (day === "sunday") return { day, closed: true };
        return { day, closed: false, opens: "09:00", closes: "18:00" };
    }),
    note: "",
    exceptions: [],
};

/** "09:00" → "9:00 AM" */
export function to12h(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function hoursText(h: { closed: boolean; opens?: string; closes?: string }): string {
    return !h.closed && h.opens && h.closes ? `${to12h(h.opens)} – ${to12h(h.closes)}` : "Closed";
}

/** Returns the problem with an entry, or null when it's valid (mirrors the server rules). */
export function timesProblem(h: { closed: boolean; opens?: string; closes?: string }): string | null {
    if (h.closed) return null;
    if (!h.opens || !h.closes) return "Set both an opening and a closing time.";
    if (h.opens >= h.closes) return "Closing time must be after opening time.";
    return null;
}

export type HoursRow = { label: string; hours: string; days: Weekday[]; closed: boolean; opens?: string; closes?: string };

/**
 * Groups consecutive days with identical hours:
 * Mon–Fri 9–6, Sat 10–2, Sun closed → three rows ("Mon – Fri", "Saturday", "Sunday").
 */
export function groupWeekly(weekly: DayHours[]): HoursRow[] {
    const byDay = new Map(weekly.map((d) => [d.day, d]));
    const rows: HoursRow[] = [];
    for (const day of WEEKDAYS) {
        const d = byDay.get(day) ?? { day, closed: true };
        const key = hoursText(d);
        const last = rows[rows.length - 1];
        if (last && last.hours === key) {
            last.days.push(day);
        } else {
            rows.push({ label: "", hours: key, days: [day], closed: key === "Closed", opens: d.opens, closes: d.closes });
        }
    }
    for (const r of rows) {
        const first = DAY_LABEL[r.days[0]];
        const lastDay = DAY_LABEL[r.days[r.days.length - 1]];
        r.label = r.days.length === 1 ? first.long : `${first.short} – ${lastDay.short}`;
    }
    return rows;
}

/** One-liner of open periods, e.g. "Mon – Fri 9:00 AM – 6:00 PM · Saturday 10:00 AM – 2:00 PM" */
export function openHoursSummary(weekly: DayHours[]): string {
    return groupWeekly(weekly)
        .filter((r) => !r.closed)
        .map((r) => `${r.label} ${r.hours}`)
        .join(" · ");
}

/** Local date as YYYY-MM-DD (not UTC, so "today" matches the visitor's calendar). */
export function todayIso(now = new Date()): string {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/** Special dates from today onwards, soonest first. */
export function upcomingExceptions(exceptions: HoursException[], limit = 5, now = new Date()): HoursException[] {
    const today = todayIso(now);
    return exceptions
        .filter((e) => e.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, limit);
}

/** "2026-12-25" → "Fri 25 Dec 2026" */
export function formatExceptionDate(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/**
 * Cleans an editor draft into the shape the API accepts (drops times on
 * closed entries, trims text) and lists anything that would be rejected.
 * The editor only saves when `problems` is empty.
 */
export function prepareOpeningHours(draft: Partial<OpeningHours>): { hours: OpeningHours; problems: string[] } {
    const problems: string[] = [];
    const clean = <T extends { closed: boolean; opens?: string; closes?: string }>(e: T): T => {
        const { opens, closes, ...rest } = e;
        return (e.closed ? rest : { ...rest, opens: opens || undefined, closes: closes || undefined }) as T;
    };

    const byDay = new Map((draft.weekly ?? []).map((d) => [d.day, d]));
    const weekly = WEEKDAYS.map((day) => clean(byDay.get(day) ?? { day, closed: true }));
    for (const d of weekly) {
        const p = timesProblem(d);
        if (p) problems.push(`${DAY_LABEL[d.day].long}: ${p}`);
    }

    const exceptions = (draft.exceptions ?? []).map((e, i) => {
        const ex = clean({ date: e.date ?? "", label: (e.label ?? "").trim(), closed: Boolean(e.closed), opens: e.opens, closes: e.closes });
        const name = ex.label || `Special date ${i + 1}`;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(ex.date)) problems.push(`${name}: choose a date.`);
        const p = timesProblem(ex);
        if (p) problems.push(`${name}: ${p}`);
        return ex;
    });

    return { hours: { weekly, note: (draft.note ?? "").trim(), exceptions }, problems };
}
