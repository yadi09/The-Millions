import { useState, useEffect } from "react";
import {
    useGetTestimonialsQuery,
    useUpdateTestimonialStatusMutation,
    useDeleteTestimonialMutation
} from "../../features/api/apiSlice";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Check, Trash2, ArrowUp, Link2, Copy, Loader2, ChevronLeft, ChevronRight, XCircle, RotateCcw } from "lucide-react";
import type { Testimonial } from "../../types/testimonial";
import { toast } from 'sonner';
import { ConfirmModal } from "../../components/ui/ConfirmModal";

const ITEMS_PER_PAGE = 4;

export default function TestimonialsManagement() {
    const { data: testimonials, isLoading } = useGetTestimonialsQuery({ role: 'admin' });
    const [updateStatus] = useUpdateTestimonialStatusMutation();
    const [deleteTestimonial] = useDeleteTestimonialMutation();
    const [activeView, setActiveView] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const pendingTestimonials = (testimonials || []).filter(t => t.status === 'PENDING');
    const approvedTestimonials = (testimonials || []).filter(t => t.status === 'APPROVED')
        .sort((a, b) => b.order - a.order);
    const rejectedTestimonials = (testimonials || []).filter(t => t.status === 'REJECTED');

    const currentItems =
        activeView === 'PENDING' ? pendingTestimonials
        : activeView === 'APPROVED' ? approvedTestimonials
        : rejectedTestimonials;
    const totalPages = Math.max(1, Math.ceil(currentItems.length / ITEMS_PER_PAGE));

    // Reset page to 1 whenever view changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeView]);

    const paginatedItems = currentItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleCopyLink = () => {
        const link = `${window.location.origin}/submit-testimonial`;
        navigator.clipboard.writeText(link);
        toast.success('Submission link copied to clipboard.');
    };

    const handleApprove = async (id: string) => {
        const promise = updateStatus({ id, status: 'APPROVED', order: 0 }).unwrap();
        toast.promise(promise, {
            loading: 'Approving testimonial...',
            success: 'Testimonial approved.',
            error: 'Failed to approve testimonial.'
        });
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteTestimonial(deleteId).unwrap();
            toast.success('Testimonial removed.');
        } catch {
            toast.error('Failed to delete testimonial.');
        }
    };

    const handleFeature = async (id: string, currentOrder: number) => {
        const newOrder = currentOrder === 0 ? 1 : currentOrder + 1;
        await updateStatus({ id, status: 'APPROVED', order: newOrder });
    };

    const handleUnfeature = async (id: string) => {
        await updateStatus({ id, status: 'APPROVED', order: 0 });
    };

    const handleReject = async (id: string) => {
        const promise = updateStatus({ id, status: 'REJECTED', order: 0 }).unwrap();
        toast.promise(promise, {
            loading: 'Rejecting testimonial...',
            success: 'Testimonial moved to Rejected.',
            error: 'Failed to reject testimonial.'
        });
    };

    const handleRestore = async (id: string) => {
        const promise = updateStatus({ id, status: 'PENDING', order: 0 }).unwrap();
        toast.promise(promise, {
            loading: 'Restoring testimonial...',
            success: 'Testimonial moved back to Pending.',
            error: 'Failed to restore testimonial.'
        });
    };

    const TestimonialCard = ({ t, view }: { t: Testimonial, view: 'PENDING' | 'APPROVED' | 'REJECTED' }) => (
        <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-none hover:border-millions-accent/30 active:bg-white/[0.08] transition-all duration-500 group animate-fade-in-up shadow-sm hover:shadow-xl">
            <CardContent className="p-5 sm:p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 sm:gap-5 md:gap-6 mb-5 sm:mb-6">
                            <div className="relative shrink-0">
                                <img
                                    src={t.image || "/placeholder.svg"}
                                    alt={t.name}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-none object-cover border border-white/5 aspect-square group-hover:border-millions-accent/30 transition-all grayscale group-hover:grayscale-0 duration-700"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-millions-dark border border-millions-accent flex items-center justify-center">
                                    <Badge className="p-0 bg-transparent text-millions-accent text-[0.5rem] font-bold">{t.rating}</Badge>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-cormorant text-[1.2rem] sm:text-[1.3rem] md:text-[1.4rem] text-white font-light group-hover:text-millions-accent transition-colors italic break-words">{t.name}</h3>
                                <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                                    <span className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.15em]">{t.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/5" />
                                    <span className="text-[0.55rem] sm:text-[0.6rem] font-jost text-millions-accent/40 uppercase tracking-widest italic">{t.location}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[0.65rem] sm:text-[0.7rem] text-white/30 font-jost mb-4 uppercase tracking-wider font-light break-words">
                            {t.role} @ <span className="text-white/50">{t.company}</span>
                        </p>

                        <div className="relative mb-5 sm:mb-6">
                            <div className="absolute -left-2 sm:-left-4 top-0 text-millions-accent/5 font-cormorant text-4xl sm:text-5xl md:text-6xl leading-none">“</div>
                            <div className="bg-white/5 p-4 sm:p-5 md:p-6 border-l-2 border-millions-accent/20 italic text-white/60 font-cormorant text-[1rem] sm:text-[1.05rem] md:text-[1.1rem] leading-relaxed font-light">
                                {t.content}
                            </div>
                        </div>

                        {t.results && (
                            <div className="flex items-center gap-3 bg-millions-accent/5 px-3 sm:px-4 py-2 border border-millions-accent/5 max-w-fit">
                                <span className="text-[0.55rem] sm:text-[0.6rem] uppercase tracking-widest text-millions-accent/60 font-bold">Impact:</span>
                                <span className="text-[0.65rem] sm:text-[0.7rem] text-white/60 font-jost italic font-light tracking-wide">{t.results}</span>
                            </div>
                        )}
                    </div>

                    {/* Action sidebar: stacks vertically on mobile (full-width buttons),
                        column on md+ (right-aligned narrow column). The flex-wrap on
                        mobile keeps three buttons safe even at 320px viewport. */}
                    <div className="flex flex-col md:flex-col gap-2 sm:gap-3 md:min-w-[150px] pt-5 md:pt-0 border-t border-white/5 md:border-t-0">
                        {view === 'PENDING' && (
                            <>
                                <Button onClick={() => handleApprove(t.id)} className="w-full bg-millions-accent text-millions-dark hover:bg-white rounded-none uppercase text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] sm:tracking-[0.2em] font-bold h-11 transition-all">
                                    <Check className="w-4 h-4 mr-2" /> Approve
                                </Button>
                                <Button onClick={() => handleReject(t.id)} variant="outline" className="w-full border-red-400/20 text-red-400/70 hover:bg-red-400/5 hover:text-red-400 rounded-none uppercase text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] sm:tracking-[0.2em] font-medium h-11 transition-all">
                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                </Button>
                            </>
                        )}
                        {view === 'APPROVED' && (
                            <>
                                {t.order === 0 ? (
                                    <Button onClick={() => handleFeature(t.id, t.order)} variant="outline" className="w-full border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 rounded-none uppercase text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] sm:tracking-[0.2em] font-medium h-11 transition-all">
                                        <ArrowUp className="w-4 h-4 mr-2" /> Feature
                                    </Button>
                                ) : (
                                    <Button onClick={() => handleUnfeature(t.id)} className="w-full bg-millions-accent/10 text-millions-accent border border-millions-accent/20 rounded-none uppercase text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] sm:tracking-[0.2em] font-bold h-11 transition-all">
                                        Featured ({t.order})
                                    </Button>
                                )}
                                <Button onClick={() => handleReject(t.id)} variant="outline" className="w-full border-red-400/20 text-red-400/70 hover:bg-red-400/5 hover:text-red-400 rounded-none uppercase text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] sm:tracking-[0.2em] font-medium h-11 transition-all">
                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                </Button>
                            </>
                        )}
                        {view === 'REJECTED' && (
                            <Button onClick={() => handleRestore(t.id)} variant="outline" className="w-full border-millions-accent/30 text-millions-accent hover:bg-millions-accent/10 rounded-none uppercase text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] sm:tracking-[0.2em] font-medium h-11 transition-all">
                                <RotateCcw className="w-4 h-4 mr-2" /> Restore<span className="hidden sm:inline"> to Pending</span>
                            </Button>
                        )}
                        <Button onClick={() => handleDelete(t.id)} variant="ghost" className="w-full text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-none uppercase text-[0.55rem] sm:text-[0.6rem] tracking-[0.15em] sm:tracking-[0.2em] h-11 transition-all">
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
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* View Switcher Toggle */}
            <div className="flex items-center gap-8 border-b border-white/5 pb-2 animate-fade-in">
                <button
                    onClick={() => setActiveView('PENDING')}
                    className={`pb-4 px-2 text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all relative ${
                        activeView === 'PENDING' ? 'text-millions-accent' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    Pending Sync
                    {pendingTestimonials.length > 0 && (
                        <span className="ml-3 text-[0.6rem] bg-millions-accent/10 border border-millions-accent/20 px-2 py-0.5 text-millions-accent">
                            {pendingTestimonials.length}
                        </span>
                    )}
                    {activeView === 'PENDING' && (
                        <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-millions-accent animate-in fade-in slide-in-from-left-4 duration-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveView('APPROVED')}
                    className={`pb-4 px-2 text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all relative ${
                        activeView === 'APPROVED' ? 'text-millions-accent' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    Live Proof
                    <span className="ml-3 text-[0.6rem] bg-white/5 border border-white/10 px-2 py-0.5 text-white/40">
                        {approvedTestimonials.length}
                    </span>
                    {activeView === 'APPROVED' && (
                        <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-millions-accent animate-in fade-in slide-in-from-right-4 duration-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveView('REJECTED')}
                    className={`pb-4 px-2 text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all relative ${
                        activeView === 'REJECTED' ? 'text-red-400' : 'text-white/20 hover:text-white/40'
                    }`}
                >
                    Rejected
                    {rejectedTestimonials.length > 0 && (
                        <span className="ml-3 text-[0.6rem] bg-red-400/10 border border-red-400/20 px-2 py-0.5 text-red-400">
                            {rejectedTestimonials.length}
                        </span>
                    )}
                    {activeView === 'REJECTED' && (
                        <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-red-400 animate-in fade-in slide-in-from-right-4 duration-500" />
                    )}
                </button>
            </div>

            <div className="animate-fade-in-up space-y-10">
                {paginatedItems.length === 0 ? (
                    <div className="text-center p-24 border border-dashed border-white/5 bg-white/5 rounded-none">
                        <p className="font-cormorant text-white/20 italic text-xl font-light">
                            {activeView === 'PENDING'
                                ? 'The queue is currently silent.'
                                : activeView === 'APPROVED'
                                ? 'No active evidence.'
                                : 'No rejected submissions.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {paginatedItems.map(t => (
                            <TestimonialCard
                                key={t.id}
                                t={t}
                                view={activeView}
                            />
                        ))}
                    </div>
                )}

                {/* Architectural Pagination Controls */}
                {currentItems.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
                        <div className="flex items-center gap-4 text-millions-accent text-[0.6rem] tracking-[0.3em] uppercase order-2 sm:order-1 outline-none">
                            <div className="w-10 h-[1px] bg-millions-accent/30" />
                            Refinement Page {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
                        </div>
                        
                        <div className="flex items-center gap-px order-1 sm:order-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="border-white/5 bg-transparent text-white/40 hover:bg-white/5 hover:text-white rounded-none h-12 w-12 p-0 disabled:opacity-5 transition-all outline-none"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="border-white/5 bg-transparent text-white/40 hover:bg-white/5 hover:text-white rounded-none h-12 w-12 p-0 disabled:opacity-5 transition-all outline-none"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Testimonial"
                message="Are you sure you want to permanently delete this testimonial? This action cannot be undone."
                confirmText="Delete Testimonial"
            />
        </div>
    );
}
