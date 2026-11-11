import { SubPageHero } from "../../components/SubPageHero"
import { Seo } from "../../components/Seo"
import { sanitizeHtml } from "../../utils/sanitize"
import { useLegalPage } from "../../utils/useSiteSetting"
import { useSiteContact } from "../../utils/useSiteContact"
import { formatExceptionDate } from "../../data/businessHours"

type LegalPageKey = "privacy-page" | "cookies-page" | "terms-page"

const PAGES: Record<LegalPageKey, { title: string; seoTitle: string; description: string; label: string; subText: string }> = {
    "privacy-page": {
        title: "Privacy Policy",
        seoTitle: "Privacy Policy | The Millions",
        description: "How The Millions collects, uses and protects your personal information.",
        label: "Your Data",
        subText: "How we collect, use and protect your personal information.",
    },
    "cookies-page": {
        title: "Cookie Policy",
        seoTitle: "Cookie Policy | The Millions",
        description: "The cookies used on The Millions website and how to manage them.",
        label: "Cookies",
        subText: "What cookies this website uses and how you can control them.",
    },
    "terms-page": {
        title: "Terms of Use",
        seoTitle: "Terms of Use | The Millions",
        description: "The terms that apply when you use The Millions website.",
        label: "Legal",
        subText: "The terms that apply when you use this website.",
    },
}

// Renders an admin-editable policy page. Wording is supplied by the owner in
// the site editor (click the page content with ?edit=1); sections without
// text yet say so plainly instead of showing placeholder copy.
export default function LegalPage({ pageKey }: { pageKey: LegalPageKey }) {
    const meta = PAGES[pageKey]
    const { page, isLoading } = useLegalPage(pageKey)
    const contact = useSiteContact()
    const sections = page?.sections ?? []
    const hasGaps = !isLoading && (sections.length === 0 || sections.some((s) => !s.body?.trim()))

    return (
        <main className="min-h-screen bg-millions-light">
            <Seo title={meta.seoTitle} description={meta.description} />
            <SubPageHero label={meta.label} title={meta.title} subText={meta.subText} />

            <article
                data-editable-section={pageKey}
                className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-20 font-jost text-millions-body"
            >
                {page?.lastUpdated && (
                    <p className="text-[0.7rem] tracking-[0.2em] uppercase text-millions-body mb-8">
                        Last updated: {formatExceptionDate(page.lastUpdated)}
                    </p>
                )}

                {isLoading && <p className="italic text-millions-body">Loading…</p>}

                {hasGaps && (
                    <div className="mb-10 border-l-2 border-millions-accent bg-white/70 px-5 py-4 text-[0.85rem] leading-relaxed">
                        This policy is being finalised.
                        {contact.email && (
                            <> If you have a question in the meantime, email{" "}
                                <a href={`mailto:${contact.email}`} className="text-millions-dark underline underline-offset-4">{contact.email}</a>.
                            </>
                        )}
                    </div>
                )}

                {page?.intro?.trim() && (
                    <div className="legal-prose mb-10" dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.intro) }} />
                )}

                <div className="space-y-10">
                    {sections.map((s, i) => (
                        <section key={i} aria-labelledby={`legal-${i}`}>
                            <h2 id={`legal-${i}`} className="font-cormorant text-millions-dark text-[1.6rem] font-light mb-3">
                                {s.heading}
                            </h2>
                            {s.body?.trim() ? (
                                <div className="legal-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(s.body) }} />
                            ) : (
                                <p className="italic text-[0.9rem]">This section is being finalised.</p>
                            )}
                        </section>
                    ))}
                </div>
            </article>
        </main>
    )
}
