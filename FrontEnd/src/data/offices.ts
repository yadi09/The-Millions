// One place for how the firm describes its offices in code-rendered text
// (contact page, map section). CMS sections (home page "Our Global
// Presence", hero stats) have their own wording — see the "Edit in admin"
// list in the Phase 3 report.
//
// TODO(owner): confirm which office is the headquarters. The home page calls
// London the headquarters, the contact page called Southampton the "Global
// Headquarters", and the only published address is Southampton. Until that's
// confirmed, the code uses neutral wording and doesn't call either office
// "headquarters".

export const PRIMARY_OFFICE = {
    /** Short label above the address in the contact sidebar. */
    label: "Our Office",
    /** Heading over the map. */
    mapHeading: "Visit Our Southampton Office",
    mapSubText: "Find us at Terminus Terrace in Southampton. Get in touch before visiting so we can make sure the right person is available to meet you.",
    /** Google Maps search query for the click-to-load map. */
    mapQuery: "Terminus Terrace, Southampton SO14 3FD, UK",
} as const;
