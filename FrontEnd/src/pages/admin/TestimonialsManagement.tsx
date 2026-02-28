import { useState } from "react";
import {
    useGetTestimonialsQuery,
    useUpdateTestimonialStatusMutation,
    useDeleteTestimonialMutation
} from "../../features/api/apiSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
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
        if (confirm("Are you sure you want to delete this testimonial?")) {
            await deleteTestimonial(id);
        }
    };

    const handleFeature = async (id: string, currentOrder: number) => {
        // Basic bumping of order for simplicity of demo
        const newOrder = currentOrder === 0 ? 1 : currentOrder + 1;
        await updateStatus({ id, status: 'approved', order: newOrder });
    };

    const handleUnfeature = async (id: string) => {
        await updateStatus({ id, status: 'approved', order: 0 });
    };

    const TestimonialCard = ({ t, isPending }: { t: Testimonial, isPending: boolean }) => (
        <Card className="mb-4 shadow-sm border-slate-200">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={t.image || "/placeholder.svg"}
                                alt={t.name}
                                className="w-12 h-12 rounded-full object-cover border border-slate-200 aspect-square shrink-0"
                            />
                            <div>
                                <h3 className="font-semibold text-lg text-slate-900">{t.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-slate-100">{t.rating} Stars</Badge>
                                    <Badge variant="outline" className="text-xs">{t.category}</Badge>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">{t.email}</p>
                        <p className="text-sm text-slate-500 mb-4">{t.role} at <span className="font-medium">{t.company}</span> • {t.location}</p>
                        <div className="bg-slate-50 p-4 rounded-lg italic text-slate-700 border border-slate-100 mb-4">
                            "{t.content}"
                        </div>
                        {t.results && (
                            <p className="text-sm text-green-700 font-medium bg-green-50 inline-block px-3 py-1 rounded border border-green-100">
                                Results: {t.results}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 min-w-[140px]">
                        {isPending ? (
                            <Button onClick={() => handleApprove(t.id)} className="w-full bg-green-600 hover:bg-green-700">
                                <Check className="w-4 h-4 mr-2" /> Approve
                            </Button>
                        ) : (
                            t.order === 0 ? (
                                <Button onClick={() => handleFeature(t.id, t.order)} variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                                    <ArrowUp className="w-4 h-4 mr-2" /> Feature
                                </Button>
                            ) : (
                                <Button onClick={() => handleUnfeature(t.id)} variant="secondary" className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200">
                                    Featured ({t.order})
                                </Button>
                            )
                        )}
                        <Button onClick={() => handleDelete(t.id)} variant="destructive" className="w-full opacity-90">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading testimonials...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Testimonials</h1>
                    <p className="text-slate-500 mt-2">Manage client success stories and reviews.</p>
                </div>
            </div>

            {/* Share Link Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2 mb-2">
                            <Link2 className="w-5 h-5" />
                            Shareable Submission Link
                        </h3>
                        <p className="text-blue-700 text-sm mb-4">
                            Send this private link to your clients so they can submit their own testimonials. Submissions will appear in the Pending queue below.
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="bg-white px-4 py-2 rounded border border-blue-200 text-slate-600 flex-1 overflow-x-auto text-sm">
                                {`${window.location.origin}/submit-testimonial`}
                            </code>
                            <Button onClick={handleCopyLink} variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0">
                                {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Pending Area */}
                <div>
                    <CardHeader className="px-0">
                        <CardTitle className="text-xl flex items-center gap-2">
                            Pending Reviews
                            {pendingTestimonials.length > 0 && (
                                <Badge className="bg-amber-500 hover:bg-amber-600">{pendingTestimonials.length}</Badge>
                            )}
                        </CardTitle>
                        <CardDescription>Awaiting your approval before going live.</CardDescription>
                    </CardHeader>
                    <div className="mt-4">
                        {pendingTestimonials.length === 0 ? (
                            <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <p className="text-slate-500">No pending testimonials.</p>
                            </div>
                        ) : (
                            pendingTestimonials.map(t => <TestimonialCard key={t.id} t={t} isPending={true} />)
                        )}
                    </div>
                </div>

                {/* Live Area */}
                <div>
                    <CardHeader className="px-0">
                        <CardTitle className="text-xl text-green-700 flex items-center gap-2">
                            Live Testimonials
                            <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                                {approvedTestimonials.length}
                            </Badge>
                        </CardTitle>
                        <CardDescription>Currently displayed on the public website.</CardDescription>
                    </CardHeader>
                    <div className="mt-4">
                        {approvedTestimonials.length === 0 ? (
                            <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <p className="text-slate-500">No approved testimonials.</p>
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
