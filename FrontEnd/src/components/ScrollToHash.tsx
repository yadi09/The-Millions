import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToHash = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Delay to allow page content to render
        const id = hash.replace("#", "");
        const element = document.getElementById(id);

        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [pathname, hash]);

    return null;
};
