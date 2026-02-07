import { LayoutTemplate, Type, Image, List, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type EditorSidebarProps = {
    sections: any[];
    activeSectionId: string | null;
    onSelectSection: (id: string) => void;
};

const getIconForType = (type: string) => {
    switch (type) {
        case 'hero': return <Image size={18} />;
        case 'services': return <List size={18} />;
        case 'cta': return <PhoneCall size={18} />;
        case 'about': return <Type size={18} />;
        default: return <LayoutTemplate size={18} />;
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
            w-full bg-white border-b border-slate-200
            flex flex-col
            md:static md:z-auto md:w-64 md:border-r md:border-b-0 md:h-full md:flex-col
        `}>
            {/* Desktop Header */}
            <div className="p-4 border-b border-slate-200 hidden md:block">
                <h2 className="font-semibold text-slate-900">Page Sections</h2>
                <p className="text-xs text-slate-500">Select a section to edit</p>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden p-2">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700"
                >
                    <div className="flex items-center gap-2">
                        {activeSection ? (
                            <>
                                {getIconForType(activeSection.type)}
                                <span className="capitalize">{activeSection.type.replace('-', ' ')}</span>
                            </>
                        ) : (
                            <span>Select Section</span>
                        )}
                    </div>
                    {isMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {/* Sections List - Dropdown on mobile, Sidebar on desktop */}
            <div className={`
                ${isMenuOpen ? 'flex' : 'hidden md:flex'}
                flex-col gap-1 p-2 bg-white
                md:flex md:flex-col md:overflow-y-auto md:space-y-1 md:p-2 md:touch-auto
            `}>
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => handleSelect(section.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors w-full
                            ${activeSectionId === section.id
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                        `}
                    >
                        {getIconForType(section.type)}
                        <span className="capitalize">{section.type.replace('-', ' ')}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EditorSidebar;
