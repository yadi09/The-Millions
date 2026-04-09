import { Link, useLocation } from 'react-router-dom';
import { FileText, LogOut, BookOpen, Star, Briefcase, User } from 'lucide-react';
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

    const navLinks = [
        { to: "/admin/pages", icon: FileText, label: "Pages" },
        { to: "/admin/blog", icon: BookOpen, label: "Blog" },
        { to: "/admin/services", icon: Briefcase, label: "Services" },
        { to: "/admin/testimonials", icon: Star, label: "Testimonials" },
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
            <div className="p-8 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-millions-accent rounded-none flex items-center justify-center text-millions-accent font-cormorant text-xl font-bold">
                        M
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-cormorant font-bold text-lg leading-none mb-1">Admin</h1>
                        <p className="text-[0.6rem] text-white/40 font-jost uppercase tracking-widest truncate">
                            {user?.email || 'admin@themillions.com'}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="p-4 mt-6 space-y-1">
                {navLinks.map((link) => {
                    const active = isActive(link.to);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={handleNavigation}
                            className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 group relative ${active
                                ? 'text-millions-accent'
                                : 'text-white/50 hover:text-white'
                                }`}
                        >
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-millions-accent" />
                            )}
                            <Icon size={18} className={`${active ? 'text-millions-accent' : 'text-white/30 group-hover:text-white/60'}`} />
                            <span className="font-jost text-[0.75rem] uppercase tracking-[0.2em] font-medium">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-0 w-full p-6 border-t border-white/5 bg-black/10">
                <div className="flex items-center gap-3 px-4 py-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-millions-accent/10 flex items-center justify-center">
                        <User size={14} className="text-millions-accent" />
                    </div>
                    <span className="text-[0.65rem] font-jost text-white/60 uppercase tracking-widest truncate">
                        {user?.email || 'Administrator'}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 transition-all font-jost text-[0.65rem] uppercase tracking-[0.2em] w-full group"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Logout
                </button>
            </div>
        </aside>
    );
};
