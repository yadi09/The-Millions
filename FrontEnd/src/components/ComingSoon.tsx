import { Link } from "react-router-dom"

type ComingSoonProps = {
    title?: string
    message?: string
    note?: string
    actionLabel?: string
    actionTo?: string
}

const ComingSoon = ({
    title = "Coming soon",
    message = "This page is not ready yet. We are building it and will publish it soon.",
    note = "If you need anything in the meantime, contact the team.",
    actionLabel = "Back to Home",
    actionTo = "/",
}: ComingSoonProps) => {
    return (
        <main className="min-h-[80vh] bg-millions-light px-[5%] flex items-center justify-center">
            <div className="mx-auto max-w-[1200px] w-full text-center">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-millions-accent animate-fade-in-up">Status: Reserved</p>
                <h1 className="mt-6 font-cormorant text-[clamp(2rem,4vw,3.2rem)] font-light text-millions-dark italic animate-fade-in-up md:animation-delay-200">{title}</h1>
                <p className="mt-6 text-[0.95rem] text-millions-body font-light max-w-sm mx-auto leading-relaxed animate-fade-in-up md:animation-delay-300">{message}</p>
                <div className="mt-10 flex justify-center animate-fade-in-up md:animation-delay-500">
                    <Link
                        to={actionTo}
                        className="bg-millions-dark text-white px-12 py-4 font-jost text-[0.75rem] tracking-[0.2em] font-bold uppercase transition-all hover:bg-millions-accent hover:text-millions-dark"
                    >
                        {actionLabel}
                    </Link>
                </div>
                <p className="mt-12 text-[0.65rem] text-millions-muted italic font-light animate-fade-in-up md:animation-delay-700">{note}</p>
            </div>
        </main>
    )
}

export default ComingSoon
