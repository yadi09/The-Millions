import { useState } from "react";
import {
    useGetTestimonialsQuery,
    useUpdateTestimonialStatusMutation,
    useDeleteTestimonialMutation
} from "../../features/api/apiSlice";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Check, Trash2, ArrowUp, Link2, Copy } from "lucide-react";
import type { Testimonial } from "../../types/testimonial";

export default function TestimonialsManagement() {
    const { data: testimonials, isLoading } = useGetTestimonialsQuery({ role: 'admin' });
    const [updateStatus] = useUpdateTestimonialStatusMutation();
    const [deleteTestimonial] = useDeleteTestimonialMutation();
    const [copied, setCopied] = useState(false);

    const pendingTestimonials = (testimonials || []).filter(t => t.status === 'pending');
    const approvedTestimonials = (testimonials || []).filter(t => t.status === 'approved')
        .sort((a, b) => b.order - a.order);

    const handleCopyLink = () => {
        const link = `${window.location.origin}/submit-testimonial`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleApprove = async (id: string) => {
        await updateStatus({ id, status: 'approved', order: 0 });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this architectural proof?")) {
            await deleteTestimonial(id);
        }
    };

    const handleFeature = async (id: string, currentOrder: number) => {
        const newOrder = currentOrder === 0 ? 1 : currentOrder + 1;
        await updateStatus({ id, status: 'approved', order: newOrder });
    };

    const handleUnfeature = async (id: string) => {
        await updateStatus({ id, status: 'approved', order: 0 });
    };

    const TestimonialCard = ({ t, isPending }: { t: Testimonial, isPending: boolean }) => (
        <Card className="mb-6 bg-white/5 border-white/10 backdrop-blur-md rounded-none hover:border-millions-accent/30 transition-all duration-500 group animate-fade-in-up">
            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="relative shrink-0">
                                <img
                                    src={t.image || "/placeholder.svg"}
                                    alt={t.name}
                                    className="w-14 h-14 rounded-none object-cover border border-white/10 aspect-square group-hover:border-millions-accent/40 transition-colors"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-millions-dark border border-millions-accent flex items-center justify-center">
                                    <Badge className="p-0 bg-transparent text-millions-accent text-[0.5rem] font-bold">{t.rating}</Badge>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-cormorant text-2xl text-white font-light group-hover:text-millions-accent transition-colors">{t.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em]">{t.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                    <span className="text-[0.6rem] font-jost text-millions-accent/60 uppercase tracking-widest italic">{t.location}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[0.75rem] text-white/40 font-jost mb-4 uppercase tracking-wider">
                            {t.role} @ <span className="text-white/60">{t.company}</span>
                        </p>

                        <div className="relative mb-6">
                            <div className="absolute -left-4 top-0 text-millions-accent/10 font-cormorant text-6xl leading-none">“</div>
                            <div className="bg-white/[0.02] p-6 border-l-2 border-millions-accent/20 italic text-white/70 font-cormorant text-xl leading-relaxed">
                                {t.content}
                            </div>
                        </div>

                        {t.results && (
                            <div className="flex items-center gap-3 bg-millions-accent/5 px-4 py-2 border border-millions-accent/10 max-w-fit">
                                <span className="text-[0.6rem] uppercase tracking-widest text-millions-accent font-bold">Impact:</span>
                                <span className="text-[0.7rem] text-white/80 font-jost italic font-light">{t.results}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 min-w-[150px] pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                        {isPending ? (
                            <Button onClick={() => handleApprove(t.id)} className="w-full bg-millions-accent text-millions-dark hover:bg-millions-accent/80 rounded-none uppercase text-[0.65rem] tracking-[0.2em] font-bold h-11">
                                <Check className="w-4 h-4 mr-2" /> Approve
                            </Button>
                        ) : (
                            t.order === 0 ? (
                                <Button onClick={() => handleFeature(t.id, t.order)} variant="outline" className="w-full border-millions-accent/40 text-millions-accent hover:bg-millions-accent/10 rounded-none uppercase text-[0.65rem] tracking-[0.2em] font-light h-11">
                                    <ArrowUp className="w-4 h-4 mr-2" /> Feature
                                </Button>
                            ) : (
                                <Button onClick={() => handleUnfeature(t.id)} className="w-full bg-millions-accent/20 text-millions-accent border border-millions-accent/30 rounded-none uppercase text-[0.65rem] tracking-[0.2em] font-bold h-11">
                                    Featured ({t.order})
                                </Button>
                            )
                        )}
                        <Button onClick={() => handleDelete(t.id)} variant="ghost" className="w-full text-white/30 hover:text-red-400 hover:bg-red-400/5 rounded-none uppercase text-[0.6rem] tracking-widest h-11">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading) return (
        <div className="p-20 text-center animate-pulse">
            <div className="w-8 h-8 border-2 border-millions-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.4em]">Syncing Impact Proof...</span>
        </div>
    );

    return (
        <div className="space-y-12 max-w-6xl mx-auto pb-20">
            <div className="animate-fade-in">
                <h1 className="font-cormorant text-4xl md:text-5xl font-light text-white mb-4 uppercase tracking-widest">
                    Impact Evidence
                </h1>
                <div className="flex items-center gap-4 text-millions-accent text-[0.7rem] tracking-[0.3em] uppercase mb-8">
                    <div className="w-8 h-[1px] bg-millions-accent" />
                    Moderate Social Proof Architecture
                </div>
            </div>

            {/* Share Link Card - Redesigned */}
            <Card className="bg-millions-accent/5 border border-millions-accent/20 rounded-none animate-fade-in-up">
                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-3">
                            <Link2 className="w-5 h-5 text-millions-accent" />
                            <h3 className="text-[0.75rem] font-jost font-bold text-white uppercase tracking-[0.3em]">
                                Architectural Submission Link
                            </h3>
                        </div>
                        <p className="text-white/40 text-sm font-jost leading-relaxed mb-6 max-w-xl">
                            Deploy this secure gateway to your clients. Submissions will be intercepted here in the Pending queue for your final refinement before going live.
                        </p>
                        <div className="flex items-stretch gap-0 border border-white/10 group focus-within:border-millions-accent/40 transition-colors">
                            <code className="bg-black/40 px-6 py-4 text-white/50 flex-1 overflow-x-auto text-[0.7rem] font-mono whitespace-nowrap">
                                {`${window.location.origin}/submit-testimonial`}
                            </code>
                            <Button
                                onClick={handleCopyLink}
                                className="bg-millions-accent text-millions-dark hover:bg-millions-accent/90 rounded-none px-8 font-jost text-[0.65rem] uppercase tracking-widest font-bold h-auto shrink-0"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Pending Area */}
                <div>
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                        <h2 className="font-cormorant text-2xl text-white font-light tracking-widest">Pending Sync</h2>
                        {pendingTestimonials.length > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 bg-millions-accent text-millions-dark rounded-full text-[0.6rem] font-bold">{pendingTestimonials.length}</span>
                        )}
                    </div>
                    <div className="space-y-0">
                        {pendingTestimonials.length === 0 ? (
                            <div className="text-center p-16 border border-dashed border-white/5 bg-white/[0.02] rounded-none">
                                <p className="font-cormorant text-white/20 italic">The queue is currently silent.</p>
                            </div>
                        ) : (
                            pendingTestimonials.map(t => <TestimonialCard key={t.id} t={t} isPending={true} />)
                        )}
                    </div>
                </div>

                {/* Live Area */}
                <div>
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                        <h2 className="font-cormorant text-2xl text-millions-accent font-light tracking-widest uppercase">Live Proof</h2>
                        <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-widest">({approvedTestimonials.length})</span>
                    </div>
                    <div className="space-y-0">
                        {approvedTestimonials.length === 0 ? (
                            <div className="text-center p-16 border border-dashed border-white/5 bg-white/[0.02] rounded-none">
                                <p className="font-cormorant text-white/20 italic text-xl">No active evidence.</p>
                            </div>
                        ) : (
                            approvedTestimonials.map(t => <TestimonialCard key={t.id} t={t} isPending={false} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
