import { Link } from "react-router-dom"
import { useSiteContact } from "../../utils/useSiteContact"
import { formatPhone } from "../../utils/phone"

// Shown for unknown URLs and for public pages toggled off in
// Admin → Site Visibility. React 19 hoists <title>/<meta> into <head>,
// so the noindex tag applies while this page is rendered.
const NotFoundPage = () => {
    const contact = useSiteContact()

    return (
        <main className="min-h-[80vh] bg-millions-light px-[5%] pt-32 pb-20 flex items-center justify-center">
            <title>Page not found | The Millions</title>
            <meta name="robots" content="noindex" />

            <div className="mx-auto max-w-[1200px] w-full text-center">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-millions-accent animate-fade-in-up">Error 404</p>
                <h1 className="mt-6 font-cormorant text-[clamp(2rem,4vw,3.2rem)] font-light text-millions-dark italic animate-fade-in-up md:animation-delay-200">
                    Page not found
                </h1>
                <p className="mt-6 text-[0.95rem] text-millions-body font-light max-w-sm mx-auto leading-relaxed animate-fade-in-up md:animation-delay-300">
                    The page you're looking for doesn't exist or has moved.
                </p>
                <div className="mt-10 flex justify-center animate-fade-in-up md:animation-delay-500">
                    <Link
                        to="/"
                        className="bg-millions-dark text-white px-12 py-4 font-jost text-[0.75rem] tracking-[0.2em] font-bold uppercase transition-all hover:bg-millions-accent hover:text-millions-dark"
                    >
                        Back to Home
                    </Link>
                </div>
                <div className="mt-12 text-[0.8rem] text-millions-body font-light flex flex-wrap justify-center gap-x-6 gap-y-2 animate-fade-in-up md:animation-delay-700">
                    {contact.phones.map((raw) => {
                        const p = formatPhone(raw)
                        return <a key={p.href} href={p.href} className="hover:text-millions-accent">{p.display}</a>
                    })}
                    {contact.email && (
                        <a href={`mailto:${contact.email}`} className="hover:text-millions-accent">{contact.email}</a>
                    )}
                </div>
            </div>
        </main>
    )
}

export default NotFoundPage
