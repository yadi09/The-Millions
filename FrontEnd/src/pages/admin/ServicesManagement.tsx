import { useState } from "react";
import {
    useGetServicesQuery,
    useDeleteServiceMutation,
} from "../../features/api/apiSlice";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
    Plus, Edit, Trash2, Server, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { ConfirmModal } from "../../components/ui/ConfirmModal";

export default function ServicesManagement() {
    const navigate = useNavigate();
    const { data: services, isLoading } = useGetServicesQuery();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteService(deleteId).unwrap();
            toast.success('Service domain removed.');
        } catch (error) {
            toast.error('Failed to delete service.');
        }
    };

    if (isLoading) return (
        <div className="p-20 text-center animate-pulse">
            <Loader2 className="w-8 h-8 text-millions-accent animate-spin mx-auto mb-4" />
            <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.25em]">Syncing Architecture...</span>
        </div>
    );

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
                    onClick={() => navigate("/admin/services/new")}
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
                                    onClick={() => navigate(`/admin/services/edit/${service.id}`)}
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

            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Service Domain"
                message="Are you sure you want to permanently delete this service domain? This action cannot be undone."
                confirmText="Delete Domain"
            />
        </div>
    );
}
