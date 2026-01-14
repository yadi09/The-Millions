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
        if (path.startsWith('/admin/pages')) return 'Pages';
        if (path.startsWith('/admin/settings')) return 'Settings';
        return 'Admin';
    };

    return (
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
            <button
                onClick={onMenuClick}
                className="p-2 -ml-2 text-slate-600 hover:text-slate-900 focus:outline-none"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            <h1 className="text-lg font-semibold text-slate-800">
                {getPageTitle()}
            </h1>

            {/* Placeholder for balance or right-side action if needed, keeping title centered or left-aligned as per standard */}
            <div className="w-8" />
        </header>
    );
};
