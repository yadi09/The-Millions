// One stored number → consistent display text and tel: link.
//
// The CMS stores phone numbers as free text (e.g. "+44 7951 7965 92"), so
// spacing is unreliable. We keep only the digits and rebuild both forms:
//   display: "+44 7951 796592"   (UK mobile grouping: 4 + 6)
//   href:    "tel:+447951796592" (no spaces)

export type FormattedPhone = { display: string; href: string };

export function formatPhone(raw: string): FormattedPhone {
    const trimmed = (raw ?? "").trim();
    let digits = trimmed.replace(/\D/g, "");

    // Normalise UK numbers to the national significant number (no 44, no 0).
    if (trimmed.startsWith("+44") || digits.startsWith("44")) {
        digits = digits.slice(2);
    } else if (digits.startsWith("0")) {
        digits = digits.slice(1);
    } else if (trimmed.startsWith("+")) {
        // Non-UK international number: don't guess its grouping.
        return { display: trimmed, href: `tel:+${digits}` };
    }

    if (digits.length !== 10) {
        // Unexpected length — show it as typed, but still give a dialable link.
        return { display: trimmed, href: `tel:+44${digits}` };
    }

    return {
        display: `+44 ${digits.slice(0, 4)} ${digits.slice(4)}`,
        href: `tel:+44${digits}`,
    };
}
