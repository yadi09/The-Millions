import { LayoutTemplate, Type, Image, List, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type EditorSidebarProps = {
    sections: any[];
    activeSectionId: string | null;
    onSelectSection: (id: string) => void;
};

const getIconForType = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
        case 'hero': return <Image className={iconClass} />;
        case 'services': return <List className={iconClass} />;
        case 'cta': return <PhoneCall className={iconClass} />;
        case 'about': return <Type className={iconClass} />;
        default: return <LayoutTemplate className={iconClass} />;
    }
};

const EditorSidebar = ({ sections, activeSectionId, onSelectSection }: EditorSidebarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const activeSection = sections.find(s => s.id === activeSectionId);

    const handleSelect = (id: string) => {
        onSelectSection(id);
        setIsMenuOpen(false);
    };

    return (
        <div className={`
            w-full h-full bg-millions-dark/80 backdrop-blur-xl border-r border-white/5
            flex flex-col z-20 transition-all duration-500
        `}>
            {/* Desktop Header */}
            <div className="p-8 border-b border-white/5 hidden md:block">
                <h2 className="font-cormorant text-[1.4rem] text-white font-light leading-none mb-4 italic">
                    Architecture
                </h2>
                <div className="flex items-center gap-3 text-millions-accent text-[0.6rem] tracking-[0.2em] uppercase opacity-50 font-light">
                    <div className="w-4 h-[1px] bg-millions-accent/40" />
                    Section Map
                </div>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden p-4 bg-black/40 border-b border-white/5">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/5 rounded-none text-[0.65rem] font-jost font-bold text-white uppercase tracking-[0.2em] transition-all"
                >
                    <div className="flex items-center gap-3">
                        {activeSection ? (
                            <>
                                <span className="text-millions-accent/60">{getIconForType(activeSection.type)}</span>
                                <span className="capitalize">{activeSection.type.replace('-', ' ')}</span>
                            </>
                        ) : (
                            <span>Select Component</span>
                        )}
                    </div>
                    {isMenuOpen ? <ChevronUp size={16} className="text-white/20" /> : <ChevronDown size={16} className="text-white/20" />}
                </button>
            </div>

            {/* Sections List */}
            <div className={`
                ${isMenuOpen ? 'flex' : 'hidden md:flex'}
                flex-col gap-0 p-0 overflow-y-auto custom-scrollbar md:h-full bg-black/5
            `}>
                {sections.map((section) => {
                    const isActive = activeSectionId === section.id;
                    return (
                        <button
                            key={section.id}
                            onClick={() => handleSelect(section.id)}
                            className={`
                                flex items-center gap-4 md:gap-6 px-5 py-4 md:px-10 md:py-6 text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.15em] transition-all duration-300 w-full border-b border-white/5 group relative overflow-hidden font-light text-left
                                ${isActive
                                    ? 'bg-white/5 text-millions-accent font-bold border-l-2 border-l-millions-accent border-b-white/5'
                                    : 'text-white/30 hover:bg-white/5 active:bg-white/[0.08] hover:text-white'
                                }
                            `}
                        >
                            <span className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-millions-accent' : 'text-white/10 group-hover:text-millions-accent/40'}`}>
                                {getIconForType(section.type)}
                            </span>
                            <span className="font-jost capitalize break-words">{section.type.replace('-', ' ')}</span>

                            {isActive && (
                                <div className="absolute right-0 top-0 h-full w-[1px] bg-millions-accent shadow-[0_0_15px_rgba(201,168,76,0.3)]" />
                            )}
                        </button>
                    );
                })}
            </div>
            
            {/* Version Badge Footer */}
            <div className="hidden md:block p-8 border-t border-white/5 mt-auto">
                 <p className="text-[0.55rem] font-jost text-white/10 uppercase tracking-[0.2em] text-center font-light">
                    Structure v1.02.SYNC
                </p>
            </div>
        </div>
    );
};

export default EditorSidebar;
