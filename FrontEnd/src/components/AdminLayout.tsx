import { useState, useEffect, type ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { MobileHeader } from './MobileHeader';

type AdminLayoutProps = {
    children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Lock body scroll while the mobile drawer is open so the underlying
    // content doesn't shift behind the overlay. Reverts on unmount or close.
    useEffect(() => {
        if (!isSidebarOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = original; };
    }, [isSidebarOpen]);

    return (
        <div className="min-h-screen bg-millions-dark flex flex-col selection:bg-millions-accent selection:text-millions-dark">
            {/* Mobile Header */}
            <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

            {/* Sidebar */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 relative min-h-screen overflow-x-hidden">
                {/* Background Pattern Sync */}
                <div className="absolute inset-0 bg-[url('/grid-subtle.svg')] bg-repeat opacity-[0.02] pointer-events-none" />
                
                {/* Subtle Gradient Accent */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-millions-accent/5 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative p-6 md:p-10 max-w-6xl mx-auto min-h-full">
                    <div className="animate-fade-in-up duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
