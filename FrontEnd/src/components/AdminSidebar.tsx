import { Link, useLocation } from 'react-router-dom';
import { LogOut, BookOpen, Star, Briefcase, User, Mail, Pencil, Settings as SettingsIcon, Palette, CreditCard, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';

type AdminSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin/login');
    };

    const handleNavigation = () => {
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    // Operational tools only — content editing has moved to inline editing
    // via the "Edit on Site" pill above. Legacy editors (/admin/landing,
    // /admin/footer, /admin/pages) remain reachable by direct URL as a
    // fallback but are no longer advertised in the nav.
    const navLinks = [
        { to: "/admin/inbox", icon: Mail, label: "Contact Inbox" },
        { to: "/admin/blog", icon: BookOpen, label: "Blog" },
        { to: "/admin/services", icon: Briefcase, label: "Services" },
        { to: "/admin/testimonials", icon: Star, label: "Testimonials" },
        { to: "/admin/brand", icon: Palette, label: "Brand Assets" },
        { to: "/admin/business-card", icon: CreditCard, label: "Business Card" },
        { to: "/admin/social-posts", icon: Sparkles, label: "Social Posts" },
        { to: "/admin/settings", icon: SettingsIcon, label: "Settings" },
    ];

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-millions-dark text-white 
                transform transition-transform duration-300 ease-in-out border-r border-white/10
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:fixed lg:z-40
            `}
        >
            <div className="p-8 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-millions-accent/40 rounded-none flex items-center justify-center text-millions-accent font-cormorant text-xl font-bold shadow-[0_0_15px_rgba(201,168,76,0.1)]">
                        M
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-cormorant font-light text-[1.1rem] leading-none mb-1 text-white">Admin <em className="italic text-millions-accent not-italic">Sync</em></h1>
                        <p className="text-[0.6rem] text-white/30 font-jost uppercase tracking-[0.2em] truncate">
                            {user?.email || 'admin@themillions.com'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-6">
                <a
                    href="/?edit=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 px-6 py-3 bg-millions-accent/10 border border-millions-accent/30 text-millions-accent hover:bg-millions-accent/20 transition-all group"
                >
                    <Pencil size={14} />
                    <span className="font-jost text-[0.65rem] uppercase tracking-[0.2em] font-medium">
                        Edit on Site
                    </span>
                </a>
            </div>

            <nav className="p-4 mt-4 space-y-2">
                {navLinks.map((link) => {
                    const active = isActive(link.to);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={handleNavigation}
                            className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 group relative ${active
                                ? 'text-millions-accent bg-white/5'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-millions-accent" />
                            )}
                            <Icon size={16} className={`${active ? 'text-millions-accent' : 'text-white/20 group-hover:text-white/40'}`} />
                            <span className="font-jost text-[0.7rem] uppercase tracking-[0.2em] font-medium">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-0 w-full p-6 border-t border-white/5 bg-white/5">
                <div className="flex items-center gap-3 px-4 py-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <User size={12} className="text-white/40" />
                    </div>
                    <span className="text-[0.65rem] font-jost text-white/40 uppercase tracking-widest truncate font-light">
                        {user?.email || 'Administrator'}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-white/30 hover:text-red-400 transition-all font-jost text-[0.6rem] uppercase tracking-[0.2em] w-full group"
                >
                    <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Logout
                </button>
            </div>
        </aside>
    );
};
