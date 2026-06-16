import { type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ComingSoonPage from "../pages/comingSoon/page";
import { useGetPublicVisibilityQuery } from "../features/api/apiSlice";
import type { RootState } from "../app/store";

type Props = {
    /** Visibility key from the backend's PAGE_KEYS list (e.g. "contact"). */
    pageKey: string;
    children: ReactNode;
};

// Gates a public route behind the page-visibility toggle. If the page is
// hidden, falls back to the existing ComingSoon screen. Authenticated
// admins with ?preview=1 in the URL bypass the gate entirely so they can
// verify content before flipping it live.
const VisibilityGate = ({ pageKey, children }: Props) => {
    const { data, isLoading } = useGetPublicVisibilityQuery();
    const [searchParams] = useSearchParams();
    const isAuthed = useSelector((s: RootState) => s.auth.isAuthenticated);
    const previewMode = searchParams.get("preview") === "1" && isAuthed;

    // While the visibility query is in flight, render the children. Even on
    // a slow connection a one-frame flash of the real page is preferable to
    // a flash of ComingSoon — the false positive is more disorienting.
    if (isLoading || !data) return <>{children}</>;

    const visible = data.pages?.[pageKey] !== false;
    if (visible || previewMode) return <>{children}</>;
    return <ComingSoonPage />;
};

export default VisibilityGate;
