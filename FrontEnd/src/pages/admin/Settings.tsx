const AdminSettings = () => {
    return (
        <div className="min-h-[70vh] sm:min-h-[80vh] flex flex-col items-center justify-center p-6 sm:p-8 text-center animate-fade-in text-white/50">
            <h2 className="font-cormorant text-[clamp(1.75rem,6vw,3rem)] font-light text-white mb-4 sm:mb-6 leading-tight">
                Settings <em className="italic text-millions-accent not-italic">Synchronization</em>
            </h2>
            <p className="text-[0.8rem] sm:text-[0.85rem] font-jost leading-relaxed tracking-wide max-w-sm mx-auto font-light">
                Global settings are being harmonized with the new architectural standards.
                <br className="hidden sm:inline" />
                Functional access to the settings panel is temporarily suspended.
            </p>
            <div className="mt-8 sm:mt-12 flex gap-3 sm:gap-4 text-millions-accent/30 items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-millions-accent/40 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-millions-accent/40 animate-pulse delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-millions-accent/40 animate-pulse delay-150" />
            </div>
        </div>
    );
};

export default AdminSettings;
