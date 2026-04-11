import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

type MobileHeaderProps = {
    onMenuClick: () => void;
};

export const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/admin') return 'Dashboard';
        if (path.startsWith('/admin/blog')) return 'Blog Posts';
        if (path.startsWith('/admin/pages')) return 'Pages';
        if (path.startsWith('/admin/settings')) return 'Settings';
        return 'Admin';
    };

    return (
        <header className="lg:hidden flex items-center justify-between p-4 bg-millions-dark border-b border-white/10 sticky top-0 z-30">
            <button
                onClick={onMenuClick}
                className="p-2 -ml-2 text-white/70 hover:text-millions-accent transition-colors focus:outline-none"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            <h1 className="text-xl font-cormorant font-light text-white tracking-widest uppercase">
                {getPageTitle()}
            </h1>

            {/* Placeholder for balance or right-side action if needed */}
            <div className="w-8" />
        </header>
    );
};
