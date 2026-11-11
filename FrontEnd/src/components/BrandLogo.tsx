import { useState } from "react";

const LOGOS = {
    // White + gold, for the dark header/footer. "-tight" is the approved
    // horizontal logo with the transparent padding trimmed from its canvas
    // (artwork unchanged), so the CSS height is the visible logo height.
    horizontal: "/brand/the-millions_horizontal_reversed-tight.svg",
    stacked: "/brand/the-millions_stacked-tagline_reversed-transparent.svg",
} as const;

// Intrinsic sizes from the SVG viewBoxes — lets the browser reserve space
// before the image loads (no layout shift).
const SIZES = {
    horizontal: { width: 1307, height: 244 },
    stacked: { width: 1064, height: 624 },
} as const;

type Props = {
    variant?: keyof typeof LOGOS;
    /** Tailwind height classes, e.g. "h-9 md:h-11". Width follows the aspect ratio. */
    className?: string;
    /** Shown if the image fails to load (the CMS "Logo Text" setting). */
    fallbackText?: string;
};

export function BrandLogo({ variant = "horizontal", className = "", fallbackText = "The Millions" }: Props) {
    const [failed, setFailed] = useState(false);
    if (failed) {
        return <span className="font-cormorant text-[1.5rem] font-semibold text-white">{fallbackText}</span>;
    }
    return (
        <img
            src={LOGOS[variant]}
            alt="The Millions"
            width={SIZES[variant].width}
            height={SIZES[variant].height}
            className={`w-auto ${className}`}
            onError={() => setFailed(true)}
            decoding="async"
        />
    );
}
