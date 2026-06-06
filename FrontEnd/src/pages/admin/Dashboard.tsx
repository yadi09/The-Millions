const AdminDashboard = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 sm:p-8 text-center animate-fade-in">
            <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-millions-accent/20 rounded-none flex items-center justify-center mb-6 sm:mb-8 relative group">
                <div className="absolute inset-0 bg-millions-accent/5 blur-xl group-hover:bg-millions-accent/10 transition-all" />
                <span className="font-cormorant text-4xl sm:text-5xl font-bold text-millions-accent relative">M</span>
            </div>

            <h1 className="font-cormorant text-[clamp(1.75rem,6vw,3.5rem)] font-light text-white mb-4 sm:mb-6 leading-tight">
                Admin <em className="italic text-millions-accent not-italic">Control Center</em>
            </h1>

            <div className="w-10 h-[1px] bg-millions-accent/30 mb-6 sm:mb-8 mx-auto" />

            <p className="max-w-md font-jost text-[0.8rem] sm:text-[0.85rem] text-white/50 leading-relaxed tracking-wide px-2">
                System Synchronization in Progress.
                <br />
                Functional access is temporarily restricted during our architectural alignment.
            </p>

            <div className="mt-8 sm:mt-12 flex gap-3 sm:gap-4 px-5 sm:px-8 py-3 sm:py-3.5 border border-white/5 bg-white/5 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-millions-accent animate-pulse shrink-0" />
                <span className="text-[0.6rem] sm:text-[0.65rem] font-jost text-white/40 uppercase tracking-[0.2em]">
                    Synchronizing Brand Identity
                </span>
            </div>
        </div>
    );
};

export default AdminDashboard;
