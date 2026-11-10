// Converts between the stored WhatsApp link (https://wa.me/<digits>?text=…)
// and the two things an admin actually edits: a phone number and an
// optional pre-filled message.

export type WhatsAppParts = { number: string; message: string };

export function parseWhatsAppUrl(url: string): WhatsAppParts {
    if (!url) return { number: "", message: "" };
    try {
        const u = new URL(url);
        // wa.me/<digits> or api.whatsapp.com/send?phone=<digits>
        const fromPath = u.pathname.replace(/\D/g, "");
        const number = fromPath || (u.searchParams.get("phone") ?? "").replace(/\D/g, "");
        return { number: number ? `+${number}` : "", message: u.searchParams.get("text") ?? "" };
    } catch {
        return { number: url, message: "" };
    }
}

/**
 * Normalises what the admin typed to international digits (no "+").
 * UK national numbers starting with 0 become 44…; "00" prefixes are dropped.
 */
export function toWhatsAppDigits(input: string): string {
    const trimmed = input.trim();
    let digits = trimmed.replace(/\D/g, "");
    if (digits.startsWith("00")) digits = digits.slice(2);
    else if (!trimmed.startsWith("+") && digits.startsWith("0")) digits = `44${digits.slice(1)}`;
    return digits;
}

/** International numbers are 8–15 digits (E.164). */
export function whatsAppNumberProblem(input: string): string | null {
    if (!input.trim()) return "Enter the phone number that should receive WhatsApp messages.";
    const digits = toWhatsAppDigits(input);
    if (digits.length < 8 || digits.length > 15) return "That doesn't look like a full phone number. Include the country code, e.g. +44 7951 796592.";
    return null;
}

export function buildWhatsAppUrl({ number, message }: WhatsAppParts): string {
    const digits = toWhatsAppDigits(number);
    if (!digits) return "";
    const text = message.trim();
    return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
