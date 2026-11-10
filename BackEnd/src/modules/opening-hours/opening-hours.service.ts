import { prisma } from "../../lib/prisma.js";
import { WEEKDAYS, openingHoursSchema, type OpeningHours } from "./opening-hours.validation.js";

const SETTING_KEY = "opening_hours";

// Used until an admin saves hours for the first time. Mirrors what the
// contact page showed before hours became editable.
export const DEFAULT_OPENING_HOURS: OpeningHours = {
    weekly: WEEKDAYS.map((day) => {
        if (day === "saturday") return { day, closed: false, opens: "10:00", closes: "14:00" };
        if (day === "sunday") return { day, closed: true };
        return { day, closed: false, opens: "09:00", closes: "18:00" };
    }),
    note: "",
    exceptions: [],
};

export async function getOpeningHours(): Promise<OpeningHours> {
    const row = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
    if (!row) return DEFAULT_OPENING_HOURS;
    // Stored data was validated on write; re-validate anyway so a bad row
    // can never break the public contact page.
    const parsed = openingHoursSchema.safeParse(row.value);
    return parsed.success ? parsed.data : DEFAULT_OPENING_HOURS;
}

export async function setOpeningHours(hours: OpeningHours): Promise<OpeningHours> {
    // Keep weekdays in calendar order and special dates sorted by date.
    const ordered: OpeningHours = {
        ...hours,
        weekly: WEEKDAYS.map((d) => hours.weekly.find((w) => w.day === d)!),
        exceptions: [...hours.exceptions].sort((a, b) => a.date.localeCompare(b.date)),
    };
    await prisma.setting.upsert({
        where: { key: SETTING_KEY },
        create: { key: SETTING_KEY, value: ordered, type: "object", group: "contact" },
        update: { value: ordered },
    });
    return ordered;
}
