import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, BookOpen, Star } from 'lucide-react';
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
        // Close sidebar on mobile when a link is clicked
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:fixed lg:z-40
            `}
        >
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Admin</h1>
                        <p className="text-xs text-slate-400">{user?.email || 'admin@example.com'}</p>
                    </div>
                </div>
            </div>

            <nav className="p-4 space-y-2">
                <Link
                    to="/admin"
                    onClick={handleNavigation}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/admin'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link
                    to="/admin/blog"
                    onClick={handleNavigation}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/blog')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <BookOpen size={20} />
                    Blog
                </Link>

                <Link
                    to="/admin/pages"
                    onClick={handleNavigation}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/pages')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <FileText size={20} />
                    Pages
                </Link>

                <Link
                    to="/admin/testimonials"
                    onClick={handleNavigation}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/testimonials')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <Star size={20} />
                    Testimonials
                </Link>

                <Link
                    to="/admin/settings"
                    onClick={handleNavigation}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/settings')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <Settings size={20} />
                    Settings
                </Link>
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};
