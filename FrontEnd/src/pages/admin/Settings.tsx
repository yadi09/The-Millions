const AdminSettings = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in text-white/50">
            <h2 className="font-cormorant text-2xl mb-4 italic">Settings Synchronization</h2>
            <p className="text-xs uppercase tracking-widest font-jost opacity-60 max-w-sm mx-auto">
                Global settings are being harmonized with the new architectural standards. 
                <br />
                Functional access to the settings panel is temporarily suspended.
            </p>
            <div className="mt-8 flex gap-3 text-millions-accent/40 items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-150" />
            </div>
        </div>
    );
};

export default AdminSettings;
