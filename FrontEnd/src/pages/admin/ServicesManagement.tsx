import { useState } from "react";
import {
    useGetServicesQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} from "../../features/api/apiSlice";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
    Plus, Edit, Trash2, X, Save, GripVertical,
    FileText, Calculator, Building, TrendingUp, Users, Briefcase, Shield, Heart, Zap,
    ChevronDown, ChevronUp
} from "lucide-react";
import type { Service, SubService } from "../../types/service";

const availableIcons: { name: string; icon: any }[] = [
    { name: "FileText", icon: FileText },
    { name: "Calculator", icon: Calculator },
    { name: "Building", icon: Building },
    { name: "TrendingUp", icon: TrendingUp },
    { name: "Users", icon: Users },
    { name: "Briefcase", icon: Briefcase },
    { name: "Shield", icon: Shield },
    { name: "Heart", icon: Heart },
    { name: "Zap", icon: Zap },
];

const getIconComponent = (name: string) => {
    return availableIcons.find(i => i.name === name)?.icon || FileText;
};

const emptySubService = (): SubService => ({
    id: `ss-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    description: "",
    items: [""],
});

const emptyService = (): Omit<Service, "id"> => ({
    icon: "FileText",
    title: "",
    description: "",
    features: [""],
    order: 0,
    subServices: [emptySubService()],
});

export default function ServicesManagement() {
    const { data: services, isLoading } = useGetServicesQuery();
    const [createService] = useCreateServiceMutation();
    const [updateService] = useUpdateServiceMutation();
    const [deleteService] = useDeleteServiceMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<Omit<Service, "id">>(emptyService());
    const [expandedSubServices, setExpandedSubServices] = useState<Record<string, boolean>>({});

    const openCreate = () => {
        setEditingService(null);
        const newForm = emptyService();
        newForm.order = (services?.length || 0) + 1;
        setFormData(newForm);
        setIsModalOpen(true);
    };

    const openEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            icon: service.icon,
            title: service.title,
            description: service.description,
            features: [...service.features],
            order: service.order,
            subServices: service.subServices.map(ss => ({ ...ss, items: [...ss.items] })),
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setFormData(emptyService());
    };

    const handleSave = async () => {
        if (!formData.title.trim()) return;
        if (editingService) {
            await updateService({ ...formData, id: editingService.id });
        } else {
            await createService(formData);
        }
        closeModal();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this service refinement?")) {
            await deleteService(id);
        }
    };

    const addFeature = () => setFormData(p => ({ ...p, features: [...p.features, ""] }));
    const removeFeature = (i: number) => setFormData(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));
    const updateFeature = (i: number, val: string) => setFormData(p => {
        const features = [...p.features];
        features[i] = val;
        return { ...p, features };
    });

    const addSubService = () => setFormData(p => ({ ...p, subServices: [...p.subServices, emptySubService()] }));
    const removeSubService = (i: number) => setFormData(p => ({ ...p, subServices: p.subServices.filter((_, idx) => idx !== i) }));
    const updateSubService = (i: number, field: keyof SubService, val: any) => {
        setFormData(p => {
            const subServices = p.subServices.map((ss, idx) => idx === i ? { ...ss, [field]: val } : ss);
            return { ...p, subServices };
        });
    };
    const addSubServiceItem = (ssIdx: number) => {
        setFormData(p => {
            const subServices = p.subServices.map((ss, idx) => idx === ssIdx ? { ...ss, items: [...ss.items, ""] } : ss);
            return { ...p, subServices };
        });
    };
    const removeSubServiceItem = (ssIdx: number, itemIdx: number) => {
        setFormData(p => {
            const subServices = p.subServices.map((ss, idx) =>
                idx === ssIdx ? { ...ss, items: ss.items.filter((_, ii) => ii !== itemIdx) } : ss
            );
            return { ...p, subServices };
        });
    };
    const updateSubServiceItem = (ssIdx: number, itemIdx: number, val: string) => {
        setFormData(p => {
            const subServices = p.subServices.map((ss, idx) => {
                if (idx !== ssIdx) return ss;
                const items = [...ss.items];
                items[itemIdx] = val;
                return { ...ss, items };
            });
            return { ...p, subServices };
        });
    };

    const toggleSubServiceExpanded = (id: string) => {
        setExpandedSubServices(p => ({ ...p, [id]: !p[id] }));
    };

    if (isLoading) return (
        <div className="p-20 text-center animate-pulse">
            <div className="w-8 h-8 border border-millions-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.25em]">Syncing Services...</span>
        </div>
    );

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
                <div>
                     <h1 className="font-cormorant text-[clamp(2.2rem,5vw,3.5rem)] font-light text-white mb-4 leading-none">
                        Service <em className="italic text-millions-accent not-italic">Portfolio</em>
                    </h1>
                     <div className="flex items-center gap-4 text-millions-accent text-[0.7rem] tracking-[0.2em] uppercase mb-4 md:mb-0">
                        <div className="w-8 h-[1px] bg-millions-accent/40" />
                        Refine Core Value Offerings
                    </div>
                </div>
                <Button 
                    onClick={openCreate} 
                    className="bg-millions-accent text-millions-dark hover:bg-white rounded-none uppercase tracking-[0.2em] text-[0.65rem] px-8 h-12 transition-all duration-300 font-bold"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Offering
                </Button>
            </div>

            {/* Services List */}
            <div className="grid gap-6">
                {(!services || services.length === 0) ? (
                    <div className="text-center py-24 bg-white/5 rounded-none border border-white/5 border-dashed flex flex-col items-center justify-center">
                        <span className="font-cormorant text-2xl text-white/20 italic mb-4">No architectural services deployed.</span>
                        <Button onClick={openCreate} variant="outline" className="border-white/5 text-white/30 hover:text-white rounded-none uppercase tracking-[0.2em] text-[0.6rem] h-10 transition-all">
                            Deploy First Service
                        </Button>
                    </div>
                ) : (
                    services.map((service, idx) => {
                        const IconComp = getIconComponent(service.icon);
                        return (
                            <Card 
                                key={service.id} 
                                className="bg-white/5 border-white/5 backdrop-blur-md rounded-none hover:border-millions-accent/30 transition-all duration-500 group animate-fade-in-up shadow-sm hover:shadow-xl"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-8">
                                        <div className="flex items-start gap-8 flex-1">
                                            <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-none flex items-center justify-center shrink-0 group-hover:border-millions-accent/40 transition-colors">
                                                <IconComp className="w-7 h-7 text-millions-accent" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <h3 className="font-cormorant text-[1.6rem] text-white font-light group-hover:text-millions-accent transition-colors italic">{service.title}</h3>
                                                    <Badge className="bg-white/5 text-white/20 text-[0.6rem] font-jost uppercase tracking-wider border-white/5 rounded-none font-light">
                                                        No. {service.order}
                                                    </Badge>
                                                </div>
                                                <p className="text-[0.85rem] text-white/40 font-jost leading-relaxed mb-6 max-w-2xl font-light">{service.description}</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {service.features.map((f, i) => (
                                                        <Badge 
                                                            key={i} 
                                                            className="bg-transparent border border-white/5 text-[0.6rem] text-white/50 font-jost uppercase tracking-[0.15em] py-1 px-3 rounded-none italic font-light"
                                                        >
                                                            {f}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col gap-3 shrink-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                                            <Button 
                                                onClick={() => openEdit(service)} 
                                                variant="ghost" 
                                                className="w-full text-millions-accent text-[0.65rem] uppercase tracking-[0.2em] font-bold hover:bg-millions-accent/10 rounded-none h-11 border border-millions-accent/20 transition-all"
                                            >
                                                <Edit className="w-4 h-4 mr-2" /> Refine
                                            </Button>
                                            <Button 
                                                onClick={() => handleDelete(service.id)} 
                                                variant="ghost" 
                                                className="w-full text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-none text-[0.6rem] uppercase tracking-[0.2em] h-11 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Modal - Dark Premium Redesign */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-millions-dark/95 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
                    <div className="w-full max-w-3xl bg-millions-dark border border-white/5 shadow-2xl rounded-none animate-in zoom-in-95 duration-300 my-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5">
                            <div>
                                <h2 className="font-cormorant text-2xl text-white font-light leading-none">
                                    {editingService ? <>Update <em className="italic text-millions-accent not-italic">Refinement</em></> : <>New <em className="italic text-millions-accent not-italic">Service Architecture</em></>}
                                </h2>
                                <p className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mt-2 opacity-60">Architectural Precision Mandatory</p>
                            </div>
                            <button onClick={closeModal} className="text-white/20 hover:text-white transition-colors p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Icon Picker */}
                            <div>
                                <label className="block text-[0.65rem] font-jost text-white/30 uppercase tracking-[0.15em] mb-4">Core Visual Identifier</label>
                                <div className="grid grid-cols-5 sm:grid-cols-9 gap-3">
                                    {availableIcons.map(({ name, icon: Icon }) => (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, icon: name }))}
                                            className={`aspect-square rounded-none border flex items-center justify-center transition-all ${formData.icon === name
                                                ? 'border-millions-accent bg-millions-accent/5 text-millions-accent'
                                                : 'border-white/5 hover:border-white/20 text-white/10'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title & Description */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="md:col-span-3">
                                    <label className="block text-[0.65rem] font-jost text-white/30 uppercase tracking-[0.15em] mb-3">Service Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-white font-jost tracking-wider text-[0.9rem] focus:border-millions-accent/30 outline-none transition-colors rounded-none placeholder:text-white/5 font-light"
                                        placeholder="EX: FINANCE ADVISORY"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[0.65rem] font-jost text-white/30 uppercase tracking-[0.15em] mb-3">Priority</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={e => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-white font-jost tracking-wider text-[0.9rem] focus:border-millions-accent/30 outline-none transition-colors rounded-none font-light"
                                        min={0}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[0.65rem] font-jost text-white/30 uppercase tracking-[0.15em] mb-3">Strategic Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/5 px-4 py-3 text-white font-jost tracking-wider text-[0.85rem] focus:border-millions-accent/30 outline-none resize-none rounded-none placeholder:text-white/5 font-light leading-relaxed"
                                    rows={3}
                                    placeholder="Briefly define the value proposition..."
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-[0.65rem] font-jost text-white/30 uppercase tracking-[0.15em] mb-4">Tactical Features</label>
                                <div className="space-y-3">
                                    {formData.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i*50}ms` }}>
                                            <GripVertical className="w-5 h-5 text-white/5 shrink-0" />
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={e => updateFeature(i, e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/5 px-4 py-3 text-white font-jost text-xs tracking-wider focus:border-millions-accent/30 outline-none rounded-none font-light"
                                                placeholder="Key feature line..."
                                            />
                                            {formData.features.length > 1 && (
                                                <button onClick={() => removeFeature(i)} className="text-white/20 hover:text-red-400 transition-colors p-2">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addFeature} className="mt-4 text-[0.6rem] text-millions-accent hover:text-white font-jost uppercase tracking-[0.25em] font-bold flex items-center gap-2 transition-colors">
                                    <Plus className="w-3 h-3" /> Insert Feature
                                </button>
                            </div>

                            {/* Sub-Services */}
                            <div className="pt-6 border-t border-white/5">
                                <label className="block text-[0.65rem] font-jost text-white/30 uppercase tracking-[0.15em] mb-6">Sub-Architecture (Tabs)</label>
                                <div className="grid gap-6">
                                    {formData.subServices.map((ss, ssIdx) => (
                                        <div key={ss.id} className="bg-white/5 border border-white/5 rounded-none overflow-hidden">
                                            <div
                                                className="flex items-center justify-between px-6 py-4 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                                                onClick={() => toggleSubServiceExpanded(ss.id)}
                                            >
                                                <span className="font-cormorant text-[1.2rem] text-white italic tracking-wider font-light">
                                                    {ss.title || `Category ${ssIdx + 1}`}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeSubService(ssIdx); }}
                                                        className="text-white/20 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    {expandedSubServices[ss.id] ? (
                                                        <ChevronUp className="w-4 h-4 text-millions-accent" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-white/20" />
                                                    )}
                                                </div>
                                            </div>

                                            {expandedSubServices[ss.id] && (
                                                <div className="p-8 space-y-8 animate-slide-down">
                                                    <input
                                                        type="text"
                                                        value={ss.title}
                                                        onChange={e => updateSubService(ssIdx, 'title', e.target.value)}
                                                        className="w-full bg-black/10 border border-white/5 px-4 py-3 text-white font-jost text-xs tracking-wider focus:border-millions-accent/30 outline-none rounded-none font-light"
                                                        placeholder="Category Title..."
                                                    />
                                                    <textarea
                                                        value={ss.description}
                                                        onChange={e => updateSubService(ssIdx, 'description', e.target.value)}
                                                        className="w-full bg-black/10 border border-white/5 px-4 py-3 text-white font-jost text-xs tracking-wider focus:border-millions-accent/30 outline-none rounded-none resize-none font-light leading-relaxed"
                                                        rows={2}
                                                        placeholder="Category context..."
                                                    />
                                                    <div>
                                                        <label className="block text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.15em] mb-4 italic font-light">Architectural List Items</label>
                                                        <div className="space-y-3 pl-4 border-l border-white/5">
                                                            {ss.items.map((item, itemIdx) => (
                                                                <div key={itemIdx} className="flex items-center gap-3">
                                                                     <div className="w-1 h-1 bg-millions-accent/30 shrink-0" />
                                                                    <input
                                                                        type="text"
                                                                        value={item}
                                                                        onChange={e => updateSubServiceItem(ssIdx, itemIdx, e.target.value)}
                                                                        className="flex-1 bg-transparent border-b border-white/5 px-2 py-2 text-white/60 font-jost text-[0.75rem] tracking-wider focus:border-millions-accent/30 outline-none transition-all font-light"
                                                                        placeholder="Point item..."
                                                                    />
                                                                    {ss.items.length > 1 && (
                                                                        <button
                                                                            onClick={() => removeSubServiceItem(ssIdx, itemIdx)}
                                                                            className="text-white/10 hover:text-red-400"
                                                                        >
                                                                            <X className="w-1.5 h-1.5" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={() => addSubServiceItem(ssIdx)}
                                                            className="mt-4 text-[0.55rem] text-white/30 hover:text-millions-accent font-jost uppercase tracking-widest flex items-center gap-2 transition-colors ml-4"
                                                        >
                                                            <Plus className="w-2.5 h-2.5" /> Add Point
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addSubService} className="mt-6 text-[0.6rem] text-millions-accent hover:text-white font-jost uppercase tracking-[0.25em] font-bold flex items-center gap-2 transition-all">
                                    <Plus className="w-3.5 h-3.5" /> Deploy New Category
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-6 px-8 py-6 border-t border-white/5 bg-white/5">
                            <Button variant="ghost" onClick={closeModal} className="text-[0.65rem] font-jost text-white/20 uppercase tracking-[0.2em] hover:text-white hover:bg-transparent transition-colors">
                                Discard Refinement
                            </Button>
                            <Button 
                                onClick={handleSave} 
                                disabled={!formData.title.trim()} 
                                className="bg-millions-accent text-millions-dark hover:bg-white rounded-none px-10 py-6 text-[0.7rem] uppercase tracking-[0.2em] font-bold shadow-xl transition-all"
                            >
                                <Save className="w-4 h-4 mr-3" />
                                {editingService ? "Sync Update" : "Deploy Architecture"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
