import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mb-2.5 block ml-1 font-medium">{children}</label>
);

export const FormSectionHeader = ({ title, icon: Icon, description }: { title: string, icon: any, description?: string }) => (
    <div className="mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/5">
                <Icon className="w-4 h-4 text-millions-accent" />
            </div>
            <div>
                <h3 className="text-[0.8rem] font-jost text-white font-bold uppercase tracking-[0.3em]">{title}</h3>
                {description && <p className="text-[0.6rem] text-white/20 font-jost uppercase tracking-widest mt-1 italic">{description}</p>}
            </div>
        </div>
    </div>
);

export const DarkInput = (props: React.ComponentProps<"input">) => (
    <Input
        {...props}
        className={`bg-white/5 border-white/10 text-white font-jost text-xs tracking-widest focus-visible:ring-0 focus-visible:border-millions-accent/40 rounded-none h-12 transition-all placeholder:text-white/5 ${props.className || ''}`}
    />
);

export const DarkTextarea = (props: React.ComponentProps<"textarea">) => (
    <Textarea
        {...props}
        className={`bg-white/5 border-white/10 text-white font-jost text-xs tracking-[0.05em] leading-relaxed focus-visible:ring-0 focus-visible:border-millions-accent/40 rounded-none min-h-[120px] transition-all placeholder:text-white/5 ${props.className || ''}`}
    />
);

export const FieldGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-3 mb-8">
        <FormLabel>{label}</FormLabel>
        {children}
    </div>
);

export const ListManager = ({ 
    items, 
    onAdd, 
    onRemove, 
    renderItem, 
    label,
    addButtonLabel = "Add Entry"
}: { 
    items: any[], 
    onAdd?: () => void, 
    onRemove?: (index: number) => void, 
    renderItem: (item: any, index: number) => React.ReactNode,
    label: string,
    addButtonLabel?: string
}) => (
    <div className="space-y-6 mb-12">
        <div className="flex items-center justify-between mb-4">
            <FormLabel>{label}</FormLabel>
            {onAdd && (
                <button 
                    onClick={(e) => { e.preventDefault(); onAdd(); }}
                    className="flex items-center gap-2 text-[0.6rem] font-jost text-millions-accent border border-millions-accent/20 px-4 py-2 hover:bg-millions-accent hover:text-millions-dark transition-all uppercase tracking-widest"
                >
                    <Plus size={12} />
                    {addButtonLabel}
                </button>
            )}
        </div>
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="flex gap-4 group p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex flex-col gap-2 mt-1 shrink-0">
                        <GripVertical size={14} className="text-white/5" />
                        {onRemove && (
                            <button 
                                onClick={(e) => { e.preventDefault(); onRemove(index); }}
                                className="text-white/10 hover:text-red-400/60 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        {renderItem(item, index)}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
