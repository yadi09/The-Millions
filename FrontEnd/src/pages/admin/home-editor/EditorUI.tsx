import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";

export const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mb-2.5 block ml-1 font-medium">{children}</label>
);

export const FormSectionHeader = ({ title, icon: Icon, description }: { title: string, icon: any, description?: string }) => (
    <div className="mb-6 sm:mb-8 md:mb-10 pb-4 sm:pb-6 border-b border-white/5">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                <Icon className="w-4 h-4 text-millions-accent" />
            </div>
            <div className="min-w-0">
                <h3 className="text-[0.7rem] sm:text-[0.75rem] md:text-[0.8rem] font-jost text-white font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] break-words">{title}</h3>
                {description && <p className="text-[0.55rem] sm:text-[0.6rem] text-white/20 font-jost uppercase tracking-widest mt-1 italic break-words">{description}</p>}
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
    <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6 md:mb-8">
        <FormLabel>{label}</FormLabel>
        {children}
    </div>
);

export const ListManager = ({ 
    items, 
    onAdd, 
    onRemove,
    onReorder,
    renderItem, 
    label,
    addButtonLabel = "Add Entry"
}: { 
    items: any[], 
    onAdd?: () => void, 
    onRemove?: (index: number) => void, 
    onReorder?: (newItems: any[]) => void,
    renderItem: (item: any, index: number) => React.ReactNode,
    label: string,
    addButtonLabel?: string
}) => {
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // To hide the default drag ghost slightly
        e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        setDragOverIndex(index);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        setDragOverIndex(null);
        if (draggedIndex === null || draggedIndex === dropIndex || !onReorder) return;

        const newItems = [...items];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(dropIndex, 0, draggedItem);
        onReorder(newItems);
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 flex-wrap">
                <FormLabel>{label}</FormLabel>
                {onAdd && (
                    <button
                        onClick={(e) => { e.preventDefault(); onAdd(); }}
                        className="flex items-center gap-2 text-[0.55rem] sm:text-[0.6rem] font-jost text-millions-accent border border-millions-accent/20 px-3 sm:px-4 py-2 hover:bg-millions-accent hover:text-millions-dark transition-all uppercase tracking-widest shrink-0"
                    >
                        <Plus size={12} />
                        {addButtonLabel}
                    </button>
                )}
            </div>
            <div className="space-y-3 sm:space-y-4">
                {items.map((item, index) => {
                    const isDragging = draggedIndex === index;
                    const isDragOver = dragOverIndex === index;

                    return (
                        <div
                            key={index}
                            draggable={!!onReorder}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                            className={`flex gap-3 sm:gap-4 group p-3 sm:p-4 bg-white/[0.02] border transition-all ${
                                isDragging ? 'opacity-50 border-millions-accent/50' :
                                isDragOver ? 'border-millions-accent translate-y-1 shadow-[0_-2px_10px_rgba(201,168,76,0.2)]' :
                                'border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className={`flex flex-col gap-2 mt-1 shrink-0 ${onReorder ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                                <GripVertical size={14} className={onReorder ? "text-white/20 group-hover:text-white/60 transition-colors" : "text-white/5"} />
                                {onRemove && (
                                    <button 
                                        onClick={(e) => { e.preventDefault(); setDeleteIndex(index); }}
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
                    );
                })}
            </div>

            <ConfirmModal
                isOpen={deleteIndex !== null}
                onClose={() => setDeleteIndex(null)}
                onConfirm={() => {
                    if (deleteIndex !== null && onRemove) {
                        onRemove(deleteIndex);
                    }
                }}
                title="Delete Confirmation"
                message="Are you sure you want to delete this entry? This action cannot be undone."
                confirmText="Delete Entry"
            />
        </div>
    );
};
