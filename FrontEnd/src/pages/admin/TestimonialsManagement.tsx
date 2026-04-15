import { useState } from "react";
import {
    useGetTestimonialsQuery,
    useUpdateTestimonialStatusMutation,
    useDeleteTestimonialMutation
} from "../../features/api/apiSlice";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Check, Trash2, ArrowUp, Link2, Copy, Loader2 } from "lucide-react";
import type { Testimonial } from "../../types/testimonial";

export default function TestimonialsManagement() {
    const { data: testimonials, isLoading } = useGetTestimonialsQuery({ role: 'admin' });
    const [updateStatus] = useUpdateTestimonialStatusMutation();
    const [deleteTestimonial] = useDeleteTestimonialMutation();
    const [copied, setCopied] = useState(false);
    const [activeView, setActiveView] = useState<'pending' | 'approved'>('pending');

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
        <Card className="mb-6 bg-white/5 border-white/5 backdrop-blur-md rounded-none hover:border-millions-accent/30 transition-all duration-500 group animate-fade-in-up shadow-sm hover:shadow-xl">
            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="relative shrink-0">
                                <img
                                    src={t.image || "/placeholder.svg"}
                                    alt={t.name}
                                    className="w-14 h-14 rounded-none object-cover border border-white/5 aspect-square group-hover:border-millions-accent/30 transition-all grayscale group-hover:grayscale-0 duration-700"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-millions-dark border border-millions-accent flex items-center justify-center">
                                    <Badge className="p-0 bg-transparent text-millions-accent text-[0.5rem] font-bold">{t.rating}</Badge>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-cormorant text-[1.4rem] text-white font-light group-hover:text-millions-accent transition-colors italic">{t.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.15em]">{t.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/5" />
                                    <span className="text-[0.6rem] font-jost text-millions-accent/40 uppercase tracking-widest italic">{t.location}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[0.7rem] text-white/30 font-jost mb-4 uppercase tracking-wider font-light">
                            {t.role} @ <span className="text-white/50">{t.company}</span>
                        </p>

                        <div className="relative mb-6">
                            <div className="absolute -left-4 top-0 text-millions-accent/5 font-cormorant text-6xl leading-none">“</div>
                            <div className="bg-white/5 p-6 border-l-2 border-millions-accent/20 italic text-white/60 font-cormorant text-[1.1rem] leading-relaxed font-light">
                                {t.content}
                            </div>
                        </div>

                        {t.results && (
                            <div className="flex items-center gap-3 bg-millions-accent/5 px-4 py-2 border border-millions-accent/5 max-w-fit">
                                <span className="text-[0.6rem] uppercase tracking-widest text-millions-accent/60 font-bold">Impact:</span>
                                <span className="text-[0.7rem] text-white/60 font-jost italic font-light tracking-wide">{t.results}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 min-w-[150px] pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                        {isPending ? (
                            <Button onClick={() => handleApprove(t.id)} className="w-full bg-millions-accent text-millions-dark hover:bg-white rounded-none uppercase text-[0.65rem] tracking-[0.2em] font-bold h-11 transition-all">
                                <Check className="w-4 h-4 mr-2" /> Approve
                            </Button>
                        ) : (
                            t.order === 0 ? (
                                <Button onClick={() => handleFeature(t.id, t.order)} variant="outline" className="w-full border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 rounded-none uppercase text-[0.65rem] tracking-[0.2em] font-medium h-11 transition-all">
                                    <ArrowUp className="w-4 h-4 mr-2" /> Feature
                                </Button>
                            ) : (
                                <Button onClick={() => handleUnfeature(t.id)} className="w-full bg-millions-accent/10 text-millions-accent border border-millions-accent/20 rounded-none uppercase text-[0.65rem] tracking-[0.2em] font-bold h-11 transition-all">
                                    Featured ({t.order})
                                </Button>
                            )
                        )}
                        <Button onClick={() => handleDelete(t.id)} variant="ghost" className="w-full text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-none uppercase text-[0.6rem] tracking-[0.2em] h-11 transition-all">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading) return (
        <div className="p-20 text-center animate-pulse">
            <Loader2 className="w-8 h-8 text-millions-accent animate-spin mx-auto mb-4" />
            <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.25em]">Syncing Impact Proof...</span>
        </div>
    );

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20">
            <div className="animate-fade-in">
                <h1 className="font-cormorant text-[clamp(2.2rem,5vw,3.5rem)] font-light text-white mb-4 leading-none">
                    Impact <em className="italic text-millions-accent not-italic">Evidence</em>
                </h1>
                <div className="flex items-center gap-4 text-millions-accent text-[0.7rem] tracking-[0.2em] uppercase mb-8">
                    <div className="w-8 h-[1px] bg-millions-accent/40" />
                    Moderate Social Proof Architecture
                </div>
            </div>

            {/* Share Link Card - Redesigned */}
            <Card className="bg-white/5 border border-white/5 rounded-none animate-fade-in-up shadow-sm">
                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-3">
                            <Link2 className="w-5 h-5 text-millions-accent/60" />
                            <h3 className="text-[0.75rem] font-jost font-bold text-white/80 uppercase tracking-[0.2em]">
                                Architectural Submission Link
                            </h3>
                        </div>
                        <p className="text-white/40 text-[0.9rem] font-jost leading-relaxed mb-6 max-w-xl font-light">
                            Deploy this secure gateway to your clients. Submissions will be intercepted here in the Pending queue for your final refinement before going live.
                        </p>
                        <div className="flex items-stretch gap-0 border border-white/5 group focus-within:border-millions-accent/30 transition-all">
                            <code className="bg-black/20 px-6 py-4 text-white/40 flex-1 overflow-x-auto text-[0.7rem] font-mono whitespace-nowrap">
                                {`${window.location.origin}/submit-testimonial`}
                            </code>
                            <Button
                                onClick={handleCopyLink}
                                className="bg-millions-accent text-millions-dark hover:bg-white rounded-none px-8 font-jost text-[0.65rem] uppercase tracking-[0.2em] font-bold h-auto shrink-0 transition-all"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* View Switcher Toggle */}
            <div className="flex items-center gap-8 border-b border-white/5 pb-2 animate-fade-in">
                <button
                    onClick={() => setActiveView('pending')}
                    className={`pb-4 px-2 text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all relative ${
                        activeView === 'pending' ? 'text-millions-accent' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    Pending Sync
                    {pendingTestimonials.length > 0 && (
                        <span className="ml-3 text-[0.6rem] bg-millions-accent/10 border border-millions-accent/20 px-2 py-0.5 text-millions-accent">
                            {pendingTestimonials.length}
                        </span>
                    )}
                    {activeView === 'pending' && (
                        <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-millions-accent animate-in fade-in slide-in-from-left-4 duration-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveView('approved')}
                    className={`pb-4 px-2 text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all relative ${
                        activeView === 'approved' ? 'text-millions-accent' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    Live Proof
                    <span className="ml-3 text-[0.6rem] bg-white/5 border border-white/10 px-2 py-0.5 text-white/40">
                        {approvedTestimonials.length}
                    </span>
                    {activeView === 'approved' && (
                        <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-millions-accent animate-in fade-in slide-in-from-right-4 duration-500" />
                    )}
                </button>
            </div>

            <div className="animate-fade-in-up">
                {activeView === 'pending' ? (
                    <div className="space-y-8">
                        {pendingTestimonials.length === 0 ? (
                            <div className="text-center p-24 border border-dashed border-white/5 bg-white/5 rounded-none">
                                <p className="font-cormorant text-white/20 italic text-xl font-light">The queue is currently silent.</p>
                            </div>
                        ) : (
                            pendingTestimonials.map(t => <TestimonialCard key={t.id} t={t} isPending={true} />)
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {approvedTestimonials.length === 0 ? (
                            <div className="text-center p-24 border border-dashed border-white/5 bg-white/5 rounded-none">
                                <p className="font-cormorant text-white/20 italic text-xl font-light">No active evidence.</p>
                            </div>
                        ) : (
                            approvedTestimonials.map(t => <TestimonialCard key={t.id} t={t} isPending={false} />)
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
