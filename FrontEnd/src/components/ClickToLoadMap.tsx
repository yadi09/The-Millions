import { useState } from "react"
import { Link } from "react-router-dom"
import { MapPin, ExternalLink } from "lucide-react"

type Props = { query: string; title: string; address: string }

// Google Maps sets third-party cookies, so the embed only loads after the
// visitor asks for it. Until then this shows a lightweight placeholder with
// the address and a direct link to Google Maps (no cookies set on our page).
export function ClickToLoadMap({ query, title, address }: Props) {
    const [loaded, setLoaded] = useState(false)
    const q = encodeURIComponent(query)

    return (
        <div className="h-[500px] bg-millions-dark border border-millions-dark/10 overflow-hidden relative group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
            {loaded ? (
                <iframe
                    title={title}
                    src={`https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08),transparent_60%)]">
                    <MapPin className="w-8 h-8 text-millions-accent mb-5" aria-hidden="true" />
                    <p className="font-cormorant text-white text-2xl font-light mb-2">{address}</p>
                    <p className="text-white/70 text-[0.8rem] font-light max-w-md leading-relaxed mb-8">
                        The map is provided by Google, which may set cookies once it loads. See our{" "}
                        <Link to="/cookies" className="underline underline-offset-4 hover:text-millions-accent">Cookie Policy</Link>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => setLoaded(true)}
                            className="bg-millions-accent text-millions-dark px-8 py-3 font-jost text-[0.75rem] tracking-[0.15em] uppercase font-medium transition-all hover:bg-[#e0bb60]"
                        >
                            Show map
                        </button>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${q}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 border border-white/30 text-white/85 px-8 py-3 font-jost text-[0.75rem] tracking-[0.15em] uppercase transition-all hover:border-millions-accent hover:text-millions-accent"
                        >
                            Open in Google Maps <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            )}
            {/* Decorative Corner Overlays */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l border-t border-millions-accent/20 m-6 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r border-b border-millions-accent/20 m-6 pointer-events-none" />
        </div>
    )
}
