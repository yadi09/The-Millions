import { Link } from "react-router-dom"
import { Button } from "./ui/button"

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
        <main className="min-h-[70vh] bg-white px-6 py-20">
            <div className="mx-auto max-w-xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Coming soon</p>
                <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
                <p className="mt-4 text-base text-slate-600 sm:text-lg">{message}</p>
                <p className="mt-3 text-sm text-slate-500">{note}</p>
                <div className="mt-6 flex justify-center">
                    <Button asChild>
                        <Link to={actionTo}>{actionLabel}</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}

export default ComingSoon
