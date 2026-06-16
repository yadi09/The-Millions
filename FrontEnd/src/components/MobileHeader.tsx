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
        if (path.startsWith('/admin/inbox')) return 'Inbox';
        if (path.startsWith('/admin/blog/edit')) return 'Edit Post';
        if (path.startsWith('/admin/blog/new')) return 'New Post';
        if (path.startsWith('/admin/blog')) return 'Blog';
        if (path.startsWith('/admin/services/edit')) return 'Edit Service';
        if (path.startsWith('/admin/services/new')) return 'New Service';
        if (path.startsWith('/admin/services')) return 'Services';
        if (path.startsWith('/admin/testimonials')) return 'Testimonials';
        if (path.startsWith('/admin/pages')) return 'Pages';
        if (path.startsWith('/admin/brand')) return 'Brand Assets';
        if (path.startsWith('/admin/settings')) return 'Settings';
        return 'Admin';
    };

    return (
        <header className="lg:hidden flex items-center justify-between p-4 bg-millions-dark border-b border-white/10 sticky top-0 z-[100]">
            <button
                onClick={onMenuClick}
                className="p-2 -ml-2 text-white/70 hover:text-millions-accent transition-colors focus:outline-none z-10"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-cormorant font-light text-white tracking-widest uppercase truncate max-w-[60%]">
                {getPageTitle()}
            </h1>

            {/* Placeholder for balance or right-side action if needed */}
            <div className="w-8" />
        </header>
    );
};
