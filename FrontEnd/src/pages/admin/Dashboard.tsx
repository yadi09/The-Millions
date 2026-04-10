const AdminDashboard = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-24 h-24 border-2 border-millions-accent/20 rounded-none flex items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 bg-millions-accent/5 blur-xl group-hover:bg-millions-accent/10 transition-all" />
                <span className="font-cormorant text-5xl font-bold text-millions-accent relative">M</span>
            </div>
            
            <h1 className="font-cormorant text-[clamp(2rem,5vw,3.5rem)] font-light text-white mb-6 leading-tight">
                Admin <em className="italic text-millions-accent not-italic">Control Center</em>
            </h1>
            
            <div className="w-10 h-[1px] bg-millions-accent/30 mb-8 mx-auto" />
            
            <p className="max-w-md font-jost text-[0.85rem] text-white/50 leading-relaxed tracking-wide">
                System Synchronization in Progress. 
                <br />
                Functional access is temporarily restricted during our architectural alignment.
            </p>
            
            <div className="mt-12 flex gap-4 px-8 py-3.5 border border-white/5 bg-white/5 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-millions-accent animate-pulse" />
                <span className="text-[0.65rem] font-jost text-white/40 uppercase tracking-[0.2em]">
                    Synchronizing Brand Identity
                </span>
            </div>
        </div>
    );
};

export default AdminDashboard;
