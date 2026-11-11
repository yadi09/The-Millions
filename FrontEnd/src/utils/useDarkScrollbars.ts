import { useEffect } from "react";

/** Dark scrollbars (incl. the page scrollbar on <html>) while the calling page is mounted. */
export function useDarkScrollbars() {
    useEffect(() => {
        document.documentElement.classList.add("dark-scroll");
        return () => document.documentElement.classList.remove("dark-scroll");
    }, []);
}
