import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetServicesQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
} from "../../features/api/apiSlice";
import { Button } from "../../components/ui/button";
import {
    X, Save, Loader2, ArrowLeft
} from "lucide-react";
import type { Service } from "../../types/service";
import { toast } from 'sonner';

const emptyService = (): Omit<Service, "id"> => ({
    name: "",
    description: "",
});

const ServiceEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: services, isLoading: isLoadingServices } = useGetServicesQuery();
    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

    const [formData, setFormData] = useState<Omit<Service, "id">>(emptyService());
    const [existingService, setExistingService] = useState<Service | null>(null);

    useEffect(() => {
        if (id && services) {
            const found = services.find(s => s.id === id);
            if (found) {
                setExistingService(found);
                setFormData({
                    name: found.name,
                    description: found.description || "",
                });
            }
        }
    }, [id, services]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Domain Nomenclature is required.');
            return;
        }
        const promise = id && existingService
            ? updateService({ ...formData, id }).unwrap()
            : createService(formData).unwrap();

        toast.promise(promise, {
            loading: 'Provisioning domain...',
            success: () => {
                navigate('/admin/services');
                return id ? 'Domain updated successfully.' : 'New domain provisioned successfully.';
            },
            error: (err: any) => err?.data?.error || err?.data?.message || 'Failed to save service.'
        });
    };

    if (id && isLoadingServices) {
        return (
            <div className="p-20 text-center animate-pulse">
                <Loader2 className="w-8 h-8 text-millions-accent animate-spin mx-auto mb-4" />
                <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.25em]">Syncing Parameters...</span>
            </div>
        );
    }

    const isProcessing = isCreating || isUpdating;

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <button 
                        onClick={() => navigate("/admin/services")}
                        className="flex items-center gap-2 text-white/40 hover:text-millions-accent transition-colors text-[0.65rem] uppercase tracking-[0.2em] mb-4 group"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Architecture
                    </button>
                    <h1 className="font-cormorant text-[2.5rem] text-white font-light leading-none">
                        {id ? <>Refine <em className="italic text-millions-accent not-italic">Domain</em></> : <>New <em className="italic text-millions-accent not-italic">Domain</em></>}
                    </h1>
                    <p className="text-white/30 text-[0.65rem] tracking-[0.2em] uppercase mt-4">
                        {id ? "Update Architectural Parameters" : "Provision Core Offering"}
                    </p>
                </div>
                
                <Button
                    onClick={() => navigate("/admin/services")}
                    variant="ghost"
                    className="text-white/20 hover:text-white rounded-none uppercase text-[0.65rem] tracking-[0.2em]"
                >
                    <X className="w-5 h-5 mr-2" /> Discard
                </Button>
            </div>

            <div className="bg-white/5 border border-white/5 p-10 md:p-14 shadow-2xl space-y-10">
                <div className="space-y-4">
                    <label className="text-[0.65rem] tracking-[0.2em] uppercase text-white/40 block">Domain Nomenclature *</label>
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 text-white p-5 h-16 font-cormorant text-2xl focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 transition-all placeholder:text-white/20"
                        placeholder="Enter service name..."
                        autoFocus
                    />
                </div>
                
                <div className="space-y-4">
                    <label className="text-[0.65rem] tracking-[0.2em] uppercase text-white/40 block">Architectural Summary</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 text-white/80 p-6 font-jost text-base font-light focus:outline-none focus:border-millions-accent/40 focus:bg-white/10 transition-all min-h-[200px] resize-none placeholder:text-white/20 leading-relaxed"
                        placeholder="Brief technical or public descriptor..."
                    />
                </div>

                <div className="pt-6 border-t border-white/5">
                    <Button
                        onClick={handleSave}
                        disabled={isProcessing || !formData.name.trim()}
                        className="w-full md:w-auto h-16 rounded-none bg-millions-accent text-millions-dark hover:bg-white tracking-[0.2em] uppercase text-[0.75rem] font-bold px-12 transition-all shadow-lg"
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                        {id ? "Deploy Refinement" : "Provision Domain"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ServiceEditor;
