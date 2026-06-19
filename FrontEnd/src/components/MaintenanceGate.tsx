import { type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";
import ComingSoonPage from "../pages/comingSoon/page";
import { useGetPublicVisibilityQuery } from "../features/api/apiSlice";
import type { RootState } from "../app/store";

// Site-wide kill switch. Wraps the public layout so that when maintenance
// is on, every public route (including blog posts and any future route)
// falls back to the ComingSoon screen in one place. Authenticated admins
// see the live site so they can keep editing, with a sticky banner so
// they never forget maintenance is still on. ?preview=1 forces them past
// the gate explicitly the same way it does for per-page visibility.
const MaintenanceGate = ({ children }: { children: ReactNode }) => {
    const { data, isLoading } = useGetPublicVisibilityQuery();
    const [searchParams] = useSearchParams();
    const isAuthed = useSelector((s: RootState) => s.auth.isAuthenticated);
    const previewOverride = searchParams.get("preview") === "1" && isAuthed;

    // Initial paint: render children optimistically so the public site
    // doesn't flash ComingSoon for a frame while the query is in flight.
    if (isLoading || !data) return <>{children}</>;

    const maintenanceOn = data.maintenance === true;

    // Non-admin and maintenance on → short-circuit to ComingSoon, full stop.
    if (maintenanceOn && !isAuthed) return <ComingSoonPage />;

    // Admin & maintenance on & NOT explicitly previewing → show ComingSoon
    // BUT also let the admin click through via the preview-1 URL. Keeps
    // the brothers from forgetting maintenance is on; if they want to
    // continue editing inline, they switch to ?preview=1.
    if (maintenanceOn && !previewOverride) {
        return (
            <div className="relative">
                <ComingSoonPage />
                <AdminPreviewHint />
            </div>
        );
    }

    // Admin & maintenance on & previewing → live content with a banner.
    return (
        <>
            {maintenanceOn && <MaintenanceBanner />}
            {children}
        </>
    );
};

// Tiny sticky banner pinned to the top of the public layout when an
// authenticated admin is previewing through maintenance mode. Reminds
// them visitors are currently seeing the ComingSoon screen.
const MaintenanceBanner = () => (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-millions-dark py-2 px-4 flex items-center justify-center gap-3 shadow-lg font-jost text-[0.7rem] sm:text-[0.75rem] tracking-[0.1em] uppercase font-bold">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>
            Maintenance mode is ON — visitors see "Coming Soon". You're previewing as admin.
        </span>
    </div>
);

// Shown on the ComingSoon fallback when an admin lands there without
// preview mode. Gives them a one-click "open this page anyway" path.
const AdminPreviewHint = () => {
    const [searchParams] = useSearchParams();
    const next = new URLSearchParams(searchParams);
    next.set("preview", "1");
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] bg-millions-dark border border-millions-accent/40 px-4 sm:px-5 py-3 shadow-2xl max-w-md mx-auto flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-millions-accent shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-[0.7rem] font-jost text-white tracking-wide leading-snug">
                    Maintenance mode is on. You're seeing the same screen visitors see.
                </p>
                <a
                    href={`?${next.toString()}`}
                    className="text-[0.65rem] font-jost text-millions-accent hover:text-white uppercase tracking-[0.2em] font-bold inline-block mt-1"
                >
                    Preview live content →
                </a>
            </div>
        </div>
    );
};

export default MaintenanceGate;
