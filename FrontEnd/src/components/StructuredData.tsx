import { useSiteContact } from "../utils/useSiteContact";
import { useOpeningHours } from "../utils/useOpeningHours";
import { formatPhone } from "../utils/phone";
import { DAY_LABEL, groupWeekly, upcomingExceptions, type OpeningHours } from "../data/businessHours";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "./Seo";

// schema.org AccountingService JSON-LD for the home page. Contact details
// and hours come from the CMS (same sources the site displays), so the
// structured data can't drift from what visitors see.

function openingHoursSpecification(hours: OpeningHours) {
    const weekly = groupWeekly(hours.weekly)
        .filter((r) => !r.closed && r.opens && r.closes)
        .map((r) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: r.days.map((d) => `https://schema.org/${DAY_LABEL[d].schema}`),
            opens: r.opens,
            closes: r.closes,
        }));

    // Special dates: schema.org marks an all-day closure as 00:00–00:00.
    const special = upcomingExceptions(hours.exceptions, 20).map((e) => ({
        "@type": "OpeningHoursSpecification",
        validFrom: e.date,
        validThrough: e.date,
        opens: e.closed ? "00:00" : e.opens,
        closes: e.closed ? "00:00" : e.closes,
    }));

    return [...weekly, ...special];
}

export function StructuredData() {
    const contact = useSiteContact();
    const hours = useOpeningHours();
    const telephone = contact.phones[0] ? formatPhone(contact.phones[0]).href.replace(/^tel:/, "") : undefined;

    const data = {
        "@context": "https://schema.org",
        "@type": "AccountingService",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
        image: `${SITE_URL}/og-image.png`,
        description: DEFAULT_DESCRIPTION,
        ...(telephone && { telephone }),
        ...(contact.email && { email: contact.email }),
        address: {
            "@type": "PostalAddress",
            streetAddress: "Terminus Terrace",
            addressLocality: "Southampton",
            postalCode: "SO14 3FD",
            addressCountry: "GB",
        },
        areaServed: "GB",
        openingHoursSpecification: openingHoursSpecification(hours),
        founder: [
            { "@type": "Person", name: "Mark Million" },
            { "@type": "Person", name: "Seleshi Million" },
        ],
    };

    return (
        <script
            type="application/ld+json"
            // JSON.stringify output is safe here except for "</script>" — escape "<".
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}
