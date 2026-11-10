import { z } from "zod";

export const WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
] as const;

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:MM (24h)");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

// Shared rule: an open entry needs both times, and closing must be after opening.
function checkTimes(
    v: { closed: boolean; opens?: string; closes?: string },
    ctx: z.RefinementCtx
) {
    if (v.closed) return;
    if (!v.opens || !v.closes) {
        ctx.addIssue({ code: "custom", message: "Opening and closing times are required" });
        return;
    }
    if (v.opens >= v.closes) {
        ctx.addIssue({ code: "custom", message: "Closing time must be after opening time" });
    }
}

const dayHours = z
    .object({
        day: z.enum(WEEKDAYS),
        closed: z.boolean(),
        opens: time.optional(),
        closes: time.optional(),
    })
    .superRefine(checkTimes);

const exception = z
    .object({
        date: isoDate,
        label: z.string().trim().max(80).default(""),
        closed: z.boolean(),
        opens: time.optional(),
        closes: time.optional(),
    })
    .superRefine(checkTimes);

export const openingHoursSchema = z
    .object({
        weekly: z.array(dayHours).length(7),
        note: z.string().trim().max(200).default(""),
        exceptions: z.array(exception).max(50).default([]),
    })
    .superRefine((v, ctx) => {
        const days = new Set(v.weekly.map((d) => d.day));
        if (days.size !== 7) {
            ctx.addIssue({ code: "custom", message: "Each day of the week must appear exactly once" });
        }
    });

export type OpeningHours = z.infer<typeof openingHoursSchema>;
