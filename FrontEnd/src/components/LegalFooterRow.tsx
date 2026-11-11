import { Link } from "react-router-dom";
import { useLegalDetails } from "../utils/useSiteSetting";
import { useEditMode } from "../features/edit/EditModeContext";

const LEGAL_LINKS = [
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/cookies", label: "Cookie Policy" },
    { to: "/terms", label: "Terms of Use" },
];

// Company/charity registration details + policy links, under the footer bar.
// Every value is admin-editable (click this row in the site editor) and
// hidden while empty — nothing placeholder-like is ever published.
export function LegalFooterRow() {
    const d = useLegalDetails();
    const { isEditing } = useEditMode();

    const company = [
        d.companyName,
        d.registeredIn && `Registered in ${d.registeredIn}`,
        d.companyNumber && `Company No. ${d.companyNumber}`,
        d.registeredOffice && `Registered office: ${d.registeredOffice}`,
    ].filter(Boolean);
    const charity = [d.charityName, d.charityNumber && `Registered charity no. ${d.charityNumber}`].filter(Boolean);
    const isEmpty = company.length === 0 && charity.length === 0 && !d.accaStatement;

    return (
        <div
            data-editable-section="legal-details"
            className="bg-[#080f0e] px-[5%] pb-6 pt-4 border-t border-white/5 text-[0.7rem] leading-relaxed font-light text-white/60 flex flex-col md:flex-row gap-3 md:items-start md:justify-between"
        >
            <div className="space-y-1 max-w-3xl">
                {company.length > 0 && <p>{company.join(" · ")}</p>}
                {d.accaStatement && <p>{d.accaStatement}</p>}
                {charity.length > 0 && <p>{charity.join(" · ")}</p>}
                {isEmpty && isEditing && (
                    <p className="italic text-millions-accent/80">Company &amp; legal details not added yet. Click here to add them.</p>
                )}
            </div>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1 shrink-0">
                {LEGAL_LINKS.map((l) => (
                    <Link key={l.to} to={l.to} className="hover:text-millions-accent transition-colors underline-offset-4 hover:underline">
                        {l.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
