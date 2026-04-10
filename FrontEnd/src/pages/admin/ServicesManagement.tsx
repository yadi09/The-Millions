import { useState } from "react";
import {
    useGetServicesQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} from "../../features/api/apiSlice";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
    Plus, Edit, Trash2, X, Save, Server, Loader2
} from "lucide-react";
import type { Service } from "../../types/service";

const emptyService = (): Omit<Service, "id"> => ({
    name: "",
    description: "",
});

export default function ServicesManagement() {
    const { data: services, isLoading } = useGetServicesQuery();
    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<Omit<Service, "id">>(emptyService());

    const openCreate = () => {
        setEditingService(null);
        setFormData(emptyService());
        setIsModalOpen(true);
    };

    const openEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description || "",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setFormData(emptyService());
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;
        try {
            if (editingService) {
                await updateService({ ...formData, id: editingService.id }).unwrap();
            } else {
                await createService(formData).unwrap();
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save service", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this architectural service block?")) {
            try {
                await deleteService(id).unwrap();
            } catch (error) {
                console.error("Failed to delete service", error);
            }
        }
    };

    if (isLoading) return (
        <div className="p-20 text-center animate-pulse">
            <Loader2 className="w-8 h-8 text-millions-accent animate-spin mx-auto mb-4" />
            <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.25em]">Syncing Architecture...</span>
        </div>
    );

    const isProcessing = isCreating || isUpdating;

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
                <div>
                    <h1 className="font-cormorant text-[clamp(2.2rem,5vw,3.5rem)] font-light text-white leading-none mb-4">
                        Service <em className="italic text-millions-accent not-italic">Architecture</em>
                    </h1>
                    <div className="flex items-center gap-4 text-millions-accent text-[0.7rem] tracking-[0.2em] uppercase">
                        <div className="w-8 h-[1px] bg-millions-accent/40" />
                        Core Offerings Control
                    </div>
                </div>
                <Button
                    onClick={openCreate}
                    className="bg-millions-accent text-millions-dark hover:bg-white rounded-none h-14 px-8 uppercase font-jost text-[0.7rem] tracking-[0.2em] font-bold transition-all shadow-lg shrink-0"
                >
                    <Plus className="w-4 h-4 mr-3" /> Add Domain
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
                {(services || []).map((service) => (
                    <Card key={service.id} className="bg-white/5 border-white/5 rounded-none shadow-xl overflow-hidden group hover:border-millions-accent/30 transition-all">
                        <CardContent className="p-8 pb-10 flex flex-col h-full relative">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-millions-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                <div className="w-12 h-12 bg-black/20 flex items-center justify-center shrink-0">
                                    <Server className="w-5 h-5 text-millions-accent/50" />
                                </div>
                                <h3 className="font-cormorant text-2xl text-white font-light leading-tight">{service.name}</h3>
                            </div>
                            
                            <p className="text-white/40 text-[0.95rem] font-jost font-light leading-relaxed flex-1 mb-8">
                                {service.description ? service.description : <span className="italic opacity-50">No architectural summary provided.</span>}
                            </p>

                            <div className="flex items-center gap-3 mt-auto border-t border-white/5 pt-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => openEdit(service)}
                                    className="flex-1 rounded-none hover:bg-millions-accent/10 hover:text-millions-accent text-white/40 tracking-[0.2em] uppercase text-[0.65rem] font-bold h-12 border border-transparent transition-all"
                                >
                                    <Edit className="w-4 h-4 mr-2" /> Modify
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleDelete(service.id)}
                                    disabled={isDeleting}
                                    className="flex-1 rounded-none hover:bg-red-500/10 hover:text-red-400 text-white/20 tracking-[0.2em] uppercase text-[0.65rem] font-bold h-12 border border-transparent transition-all"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} 
                                    Remove
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {services?.length === 0 && (
                    <div className="col-span-full py-20 border border-dashed border-white/10 text-center bg-white/5">
                        <Server className="w-10 h-10 text-white/10 mx-auto mb-4" />
                        <h3 className="font-cormorant text-2xl font-light text-white/50 mb-2">Architectural Void</h3>
                        <p className="text-white/30 text-sm font-jost">No domains currently deployed.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-millions-dark/95 backdrop-blur-md" onClick={closeModal} />
                    <div className="relative bg-millions-dark border border-white/10 w-full max-w-lg shadow-2xl p-10 animate-fade-in-up">
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 text-white/30 hover:text-millions-accent transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="mb-10 border-b border-white/5 pb-6">
                            <h2 className="font-cormorant text-[2rem] text-white font-light leading-none">
                                {editingService ? <>Refine <em className="italic text-millions-accent not-italic">Domain</em></> : <>New <em className="italic text-millions-accent not-italic">Domain</em></>}
                            </h2>
                            <p className="text-white/30 text-[0.65rem] tracking-[0.2em] uppercase mt-4">
                                {editingService ? "Update Architectural Parameters" : "Provision Core Offering"}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[0.65rem] tracking-[0.2em] uppercase text-white/40 block">Domain Nomenclature *</label>
                                <input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 text-white p-4 h-14 font-cormorant text-xl focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 transition-all placeholder:text-white/20"
                                    placeholder="Enter service name..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[0.65rem] tracking-[0.2em] uppercase text-white/40 block">Architectural Summary</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 text-white/80 p-5 font-jost text-sm font-light focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 transition-all min-h-[140px] resize-none placeholder:text-white/20"
                                    placeholder="Brief technical or public descriptor..."
                                />
                            </div>

                            <Button
                                onClick={handleSave}
                                disabled={isProcessing || !formData.name.trim()}
                                className="w-full h-14 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.2em] uppercase text-[0.75rem] font-bold mt-4"
                            >
                                {isProcessing ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                                {editingService ? "Deploy Refinement" : "Provision Domain"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
