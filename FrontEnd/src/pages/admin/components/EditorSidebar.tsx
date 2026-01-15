import { LayoutTemplate, Type, Image, List, PhoneCall } from 'lucide-react';

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
    return (
        <div className={`
            w-full bg-white border-b border-slate-200
            flex flex-col
            md:static md:z-auto md:w-64 md:border-r md:border-b-0 md:h-full md:flex-col
        `}>
            <div className="p-4 border-b border-slate-200 hidden md:block">
                <h2 className="font-semibold text-slate-900">Page Sections</h2>
                <p className="text-xs text-slate-500">Select a section to edit</p>
            </div>

            <div className={`
                flex flex-row overflow-x-auto gap-2 p-2 touch-pan-x no-scrollbar
                md:flex-col md:overflow-y-auto md:space-y-1 md:p-2 md:touch-auto
            `}>
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => onSelectSection(section.id)}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap flex-shrink-0
                            md:w-full md:gap-3 md:whitespace-normal md:flex-shrink
                            ${activeSectionId === section.id
                                ? 'bg-blue-600 text-white md:bg-blue-50 md:text-blue-700 md:font-medium shadow-sm md:shadow-none'
                                : 'bg-white text-slate-600 border border-slate-200 md:border-transparent hover:bg-slate-50 hover:text-slate-900'
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
