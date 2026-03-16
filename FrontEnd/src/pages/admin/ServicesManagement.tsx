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
        if (confirm("Are you sure you want to delete this service?")) {
            await deleteService(id);
        }
    };

    // --- Feature list helpers ---
    const addFeature = () => setFormData(p => ({ ...p, features: [...p.features, ""] }));
    const removeFeature = (i: number) => setFormData(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));
    const updateFeature = (i: number, val: string) => setFormData(p => {
        const features = [...p.features];
        features[i] = val;
        return { ...p, features };
    });

    // --- Sub-service helpers ---
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

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading services...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Services</h1>
                    <p className="text-slate-500 mt-2">Manage your service offerings displayed on the public Services page.</p>
                </div>
                <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
            </div>

            {/* Services List */}
            <div className="space-y-4">
                {(!services || services.length === 0) ? (
                    <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <p className="text-slate-500 mb-4">No services yet. Add your first service.</p>
                        <Button onClick={openCreate} variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add Service
                        </Button>
                    </div>
                ) : (
                    services.map((service) => {
                        const IconComp = getIconComponent(service.icon);
                        return (
                            <Card key={service.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                                <IconComp className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-lg text-slate-900">{service.title}</h3>
                                                    <Badge variant="secondary" className="bg-slate-100 text-xs">
                                                        Order: {service.order}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.features.slice(0, 3).map((f, i) => (
                                                        <Badge key={i} variant="outline" className="text-xs font-normal">{f}</Badge>
                                                    ))}
                                                    {service.features.length > 3 && (
                                                        <Badge variant="outline" className="text-xs font-normal text-slate-400">
                                                            +{service.features.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                                {service.subServices.length > 0 && (
                                                    <p className="text-xs text-slate-400 mt-2">
                                                        {service.subServices.length} sub-service{service.subServices.length !== 1 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                            <Button onClick={() => openEdit(service)} variant="outline" size="sm" className="border-slate-200">
                                                <Edit className="w-4 h-4 mr-1" /> Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(service.id)} variant="destructive" size="sm" className="opacity-90">
                                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[5vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingService ? "Edit Service" : "Add New Service"}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Icon Picker */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableIcons.map(({ name, icon: Icon }) => (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, icon: name }))}
                                            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${formData.icon === name
                                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-500'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title & Description */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="e.g. Accounting & Tax Compliance"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    rows={2}
                                    placeholder="Short description of this service..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={e => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    min={0}
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Features (shown on service cards)</label>
                                <div className="space-y-2">
                                    {formData.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={e => updateFeature(i, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                placeholder="Feature description..."
                                            />
                                            {formData.features.length > 1 && (
                                                <button onClick={() => removeFeature(i)} className="p-1 text-red-400 hover:text-red-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addFeature} className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Add Feature
                                </button>
                            </div>

                            {/* Sub-Services */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Sub-Services (shown in detail tabs)</label>
                                <div className="space-y-3">
                                    {formData.subServices.map((ss, ssIdx) => (
                                        <div key={ss.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                            {/* Sub-service header */}
                                            <div
                                                className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer"
                                                onClick={() => toggleSubServiceExpanded(ss.id)}
                                            >
                                                <span className="font-medium text-sm text-slate-700">
                                                    {ss.title || `Sub-service ${ssIdx + 1}`}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {formData.subServices.length > 1 && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeSubService(ssIdx); }}
                                                            className="p-1 text-red-400 hover:text-red-600"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    {expandedSubServices[ss.id] ? (
                                                        <ChevronUp className="w-4 h-4 text-slate-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sub-service body */}
                                            {expandedSubServices[ss.id] && (
                                                <div className="p-4 space-y-3">
                                                    <input
                                                        type="text"
                                                        value={ss.title}
                                                        onChange={e => updateSubService(ssIdx, 'title', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                        placeholder="Sub-service title..."
                                                    />
                                                    <textarea
                                                        value={ss.description}
                                                        onChange={e => updateSubService(ssIdx, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                                                        rows={2}
                                                        placeholder="Sub-service description..."
                                                    />
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-500 mb-1">Items</label>
                                                        <div className="space-y-1.5">
                                                            {ss.items.map((item, itemIdx) => (
                                                                <div key={itemIdx} className="flex items-center gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={item}
                                                                        onChange={e => updateSubServiceItem(ssIdx, itemIdx, e.target.value)}
                                                                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                                        placeholder="Item..."
                                                                    />
                                                                    {ss.items.length > 1 && (
                                                                        <button
                                                                            onClick={() => removeSubServiceItem(ssIdx, itemIdx)}
                                                                            className="p-1 text-red-400 hover:text-red-600"
                                                                        >
                                                                            <X className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={() => addSubServiceItem(ssIdx)}
                                                            className="mt-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                                        >
                                                            <Plus className="w-3 h-3" /> Add Item
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addSubService} className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Add Sub-Service
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                            <Button onClick={handleSave} disabled={!formData.title.trim()} className="bg-blue-600 hover:bg-blue-700">
                                <Save className="w-4 h-4 mr-2" />
                                {editingService ? "Save Changes" : "Create Service"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
