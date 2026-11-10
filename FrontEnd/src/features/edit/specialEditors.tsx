import { useEffect, useState } from "react";
import { ExternalLink, Copy } from "lucide-react";
import { buildWhatsAppUrl, parseWhatsAppUrl, whatsAppNumberProblem } from "../../utils/whatsapp";
import { formatPhone } from "../../utils/phone";
import { DAY_LABEL, WEEKDAYS, timesProblem, type DayHours } from "../../data/businessHours";

const labelClass = "block text-[0.6rem] font-jost uppercase tracking-[0.2em] text-white/40 mb-2";
const inputClass =
    "w-full bg-white/5 border border-white/10 px-3 py-2 text-white text-sm font-jost focus:outline-none focus:border-millions-accent/60 transition-colors [color-scheme:dark]";
const problemClass = "mt-1.5 text-[0.65rem] text-red-300 font-jost leading-relaxed";

// ---------------------------------------------------------------------------
// WhatsApp — admin edits a phone number + optional message; we store the
// wa.me URL. Invalid numbers are never saved (the last good link stays live).
// ---------------------------------------------------------------------------
export function WhatsAppFieldEditor({ value, onChange }: { value: string; onChange: (url: string) => void }) {
    const [number, setNumber] = useState(() => parseWhatsAppUrl(value).number);
    const [message, setMessage] = useState(() => parseWhatsAppUrl(value).message);

    // Re-sync if the stored link changes from outside this editor (e.g. the
    // footer panel and the header panel edit the same field).
    useEffect(() => {
        if (value !== buildWhatsAppUrl({ number, message })) {
            const parts = parseWhatsAppUrl(value);
            setNumber(parts.number);
            setMessage(parts.message);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const problem = whatsAppNumberProblem(number);
    const url = problem ? "" : buildWhatsAppUrl({ number, message });

    const update = (nextNumber: string, nextMessage: string) => {
        setNumber(nextNumber);
        setMessage(nextMessage);
        if (!whatsAppNumberProblem(nextNumber)) onChange(buildWhatsAppUrl({ number: nextNumber, message: nextMessage }));
    };

    return (
        <div className="space-y-5">
            <div>
                <label className={labelClass} htmlFor="wa-number">WhatsApp phone number</label>
                <input
                    id="wa-number"
                    type="tel"
                    value={number}
                    onChange={(e) => update(e.target.value, message)}
                    placeholder="+44 7951 796592"
                    className={inputClass}
                />
                {problem ? (
                    <p className={problemClass}>{problem} The site keeps using the previous number until this is fixed.</p>
                ) : (
                    <p className="mt-1.5 text-[0.65rem] text-white/30 font-jost">
                        Visitors will message {formatPhone(number).display}. UK numbers starting with 0 are converted automatically.
                    </p>
                )}
            </div>

            <div>
                <label className={labelClass} htmlFor="wa-message">Pre-filled message (optional)</label>
                <textarea
                    id="wa-message"
                    rows={3}
                    maxLength={300}
                    value={message}
                    onChange={(e) => update(number, e.target.value)}
                    placeholder="e.g. Hello The Millions, I'd like to book a consultation."
                    className={inputClass}
                />
                <p className="mt-1.5 text-[0.65rem] text-white/30 font-jost">
                    Appears in the visitor's chat box ready to send. They can change it before sending.
                </p>
            </div>

            {url && (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 transition-colors text-[0.65rem] font-jost uppercase tracking-[0.2em]"
                >
                    <ExternalLink size={12} /> Test this link
                </a>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Weekly hours — one row per day: Open/Closed + opening and closing times.
// ---------------------------------------------------------------------------
export function WeeklyHoursEditor({ value, onChange }: { value: DayHours[]; onChange: (v: DayHours[]) => void }) {
    const byDay = new Map((value ?? []).map((d) => [d.day, d]));
    const rows: DayHours[] = WEEKDAYS.map((day) => byDay.get(day) ?? { day, closed: true });

    const setDay = (day: DayHours["day"], patch: Partial<DayHours>) =>
        onChange(rows.map((r) => (r.day === day ? { ...r, ...patch } : r)));

    const copyMondayToWeekdays = () => {
        const mon = rows[0];
        onChange(rows.map((r, i) => (i >= 1 && i <= 4 ? { ...mon, day: r.day } : r)));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className={labelClass + " mb-0"}>Weekly Hours</span>
                <button
                    type="button"
                    onClick={copyMondayToWeekdays}
                    className="flex items-center gap-1.5 text-[0.6rem] font-jost uppercase tracking-[0.15em] text-millions-accent/80 hover:text-millions-accent"
                >
                    <Copy size={10} /> Copy Monday to Tue–Fri
                </button>
            </div>
            <div className="border border-white/10 divide-y divide-white/5">
                {rows.map((r) => {
                    const problem = timesProblem(r);
                    const open = !r.closed;
                    return (
                        <div key={r.day} className="px-3 py-2.5">
                            <div className="flex items-center gap-3">
                                <span className="w-12 shrink-0 text-white/70 text-[0.75rem] font-jost">{DAY_LABEL[r.day].short}</span>
                                <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={open}
                                        onChange={(e) =>
                                            setDay(r.day, e.target.checked
                                                ? { closed: false, opens: r.opens || "09:00", closes: r.closes || "17:00" }
                                                : { closed: true })
                                        }
                                        className="accent-[#C9A84C]"
                                    />
                                    <span className="text-[0.6rem] font-jost uppercase tracking-[0.15em] text-white/50 w-11">
                                        {open ? "Open" : "Closed"}
                                    </span>
                                </label>
                                {open && (
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <input
                                            type="time"
                                            aria-label={`${DAY_LABEL[r.day].long} opens`}
                                            value={r.opens ?? ""}
                                            onChange={(e) => setDay(r.day, { opens: e.target.value })}
                                            className={inputClass + " !px-2 !py-1 text-xs"}
                                        />
                                        <span className="text-white/30 text-xs">–</span>
                                        <input
                                            type="time"
                                            aria-label={`${DAY_LABEL[r.day].long} closes`}
                                            value={r.closes ?? ""}
                                            onChange={(e) => setDay(r.day, { closes: e.target.value })}
                                            className={inputClass + " !px-2 !py-1 text-xs"}
                                        />
                                    </div>
                                )}
                            </div>
                            {problem && <p className={problemClass}>{problem}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
