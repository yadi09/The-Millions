const AdminDashboard = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-24 h-24 border-2 border-millions-accent/20 rounded-none flex items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 bg-millions-accent/5 blur-xl group-hover:bg-millions-accent/10 transition-all" />
                <span className="font-cormorant text-5xl font-bold text-millions-accent relative">M</span>
            </div>
            
            <h1 className="font-cormorant text-4xl md:text-5xl font-light text-white mb-6 uppercase tracking-widest">
                Admin Control Center
            </h1>
            
            <div className="w-12 h-[1px] bg-millions-accent mb-8 mx-auto" />
            
            <p className="max-w-md font-jost text-sm text-white/40 leading-relaxed uppercase tracking-[0.15em]">
                System Synchronization in Progress. 
                <br />
                Functional access is temporarily restricted during our architectural alignment.
            </p>
            
            <div className="mt-12 flex gap-4 px-8 py-3 border border-white/5 bg-black/20 rounded-none items-center">
                <div className="w-2 h-2 rounded-full bg-millions-accent animate-pulse" />
                <span className="text-[0.6rem] font-jost text-white/60 uppercase tracking-[0.3em]">
                    Synchronizing Brand Identity
                </span>
            </div>
        </div>
    );
};

export default AdminDashboard;
