import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
    MessageSquare,
    Link2,
    Star,
    CheckCircle,
    XCircle,
    Trash2,
    Copy,
    Check,
    ChevronUp,
    Clock,
    Send,
    Eye,
    Filter,
} from 'lucide-react';
import { useTestimonials } from '../../context/TestimonialContext';
import type { TestimonialStatus } from '../../types/testimonialTypes';
import { Mail } from 'lucide-react';

type Tab = 'testimonials' | 'links';
type StatusFilter = 'all' | TestimonialStatus;

export default function AdminTestimonials() {
    const { testimonials, links, dispatch } = useTestimonials();
    const [activeTab, setActiveTab] = useState<Tab>('testimonials');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Link generation form
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');

    const pendingCount = testimonials.filter((t) => t.status === 'pending').length;

    const filtered = useMemo(() => {
        if (statusFilter === 'all') return testimonials;
        return testimonials.filter((t) => t.status === statusFilter);
    }, [testimonials, statusFilter]);

    // ── Generate Link ────────────────────────────────────────────────────
    const handleGenerateLink = () => {
        if (!recipientName.trim() || !recipientEmail.trim()) return;

        const token = crypto.randomUUID();
        dispatch({
            type: 'ADD_LINK',
            payload: {
                id: `link-${Date.now()}`,
                token,
                recipientName: recipientName.trim(),
                recipientEmail: recipientEmail.trim(),
                createdAt: new Date().toISOString(),
                used: false,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
        });

        setRecipientName('');
        setRecipientEmail('');
    };

    const copyLink = (token: string, linkId: string) => {
        const url = `${window.location.origin}/submit-testimonial/${token}`;
        navigator.clipboard.writeText(url);
        setCopiedId(linkId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const sendViaEmail = (token: string, name: string, email: string) => {
        const url = `${window.location.origin}/submit-testimonial/${token}`;
        const subject = encodeURIComponent('We\'d Love Your Testimonial — The Millions');
        const body = encodeURIComponent(
            `Hi ${name},\n\nWe truly value your experience with The Millions and would love to hear your feedback.\n\nPlease use the link below to share your testimonial:\n${url}\n\nThis link is unique to you and will expire in 30 days.\n\nThank you for your time!\n\nBest regards,\nThe Millions Team`
        );
        window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
    };

    // ── Status helpers ───────────────────────────────────────────────────
    const statusBadge = (status: TestimonialStatus) => {
        const map = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            rejected: 'bg-red-100 text-red-700 border-red-200',
        };
        return (
            <Badge variant="outline" className={`capitalize font-medium ${map[status]}`}>
                {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                {status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                {status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                {status}
            </Badge>
        );
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

    // ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Testimonials</h1>
                    <p className="text-slate-500 mt-1">
                        Manage client testimonials and generate submission links
                    </p>
                </div>
                {pendingCount > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">
                            {pendingCount} pending review
                        </span>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('testimonials')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'testimonials'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Testimonials
                    {pendingCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-semibold">
                            {pendingCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('links')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'links'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Link2 className="w-4 h-4" />
                    Generate Links
                </button>
            </div>

            {/* ── Tab: Testimonials ─────────────────────────────────────── */}
            {activeTab === 'testimonials' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${statusFilter === s
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                                {s === 'pending' && pendingCount > 0 && (
                                    <span className="ml-1.5 text-xs opacity-80">({pendingCount})</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    {filtered.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No testimonials found</p>
                                <p className="text-sm text-slate-400 mt-1">
                                    {statusFilter !== 'all'
                                        ? `No ${statusFilter} testimonials yet.`
                                        : 'Generate a link and invite clients to share their experience.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((t) => {
                                const isExpanded = expandedId === t.id;
                                return (
                                    <Card
                                        key={t.id}
                                        className={`transition-all duration-200 ${t.status === 'pending'
                                            ? 'border-l-4 border-l-amber-400'
                                            : ''
                                            }`}
                                    >
                                        <CardContent className="p-5">
                                            {/* Header Row */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <img
                                                        src={t.image || '/placeholder.svg'}
                                                        alt={t.name}
                                                        className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-semibold text-slate-900">
                                                                {t.name}
                                                            </h3>
                                                            {statusBadge(t.status)}
                                                        </div>
                                                        <p className="text-sm text-slate-500 truncate">
                                                            {t.role} · {t.company}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-0.5">
                                                                {[...Array(t.rating)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-slate-400">
                                                                · {formatDate(t.submittedAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                                        onClick={() =>
                                                            setExpandedId(isExpanded ? null : t.id)
                                                        }
                                                        title="Preview"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                    {t.status !== 'approved' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                                                            onClick={() =>
                                                                dispatch({
                                                                    type: 'APPROVE_TESTIMONIAL',
                                                                    payload: t.id,
                                                                })
                                                            }
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {t.status !== 'rejected' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                            onClick={() =>
                                                                dispatch({
                                                                    type: 'REJECT_TESTIMONIAL',
                                                                    payload: t.id,
                                                                })
                                                            }
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                        onClick={() =>
                                                            dispatch({
                                                                type: 'DELETE_TESTIMONIAL',
                                                                payload: t.id,
                                                            })
                                                        }
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="bg-slate-50 rounded-xl p-5">
                                                        <p className="text-slate-700 leading-relaxed italic">
                                                            "{t.content}"
                                                        </p>
                                                        <div className="flex flex-wrap gap-3 mt-4 text-sm">
                                                            <Badge variant="secondary">
                                                                {t.category}
                                                            </Badge>
                                                            {t.results && (
                                                                <span className="text-emerald-600 font-medium">
                                                                    Result: {t.results}
                                                                </span>
                                                            )}
                                                            {t.location && (
                                                                <span className="text-slate-400">
                                                                    📍 {t.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── Tab: Generate Links ────────────────────────────────────── */}
            {activeTab === 'links' && (
                <div className="space-y-8">
                    {/* Generate Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Send className="w-5 h-5 text-blue-600" />
                                Generate Testimonial Link
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Recipient Name
                                    </label>
                                    <Input
                                        id="link-recipient-name"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        placeholder="Client name"
                                        className="h-10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Recipient Email
                                    </label>
                                    <Input
                                        id="link-recipient-email"
                                        type="email"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        placeholder="client@example.com"
                                        className="h-10"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        onClick={handleGenerateLink}
                                        disabled={!recipientName.trim() || !recipientEmail.trim()}
                                        className="w-full h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                    >
                                        <Link2 className="w-4 h-4 mr-2" />
                                        Generate Link
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-3">
                                Links expire in 30 days. Each link can only be used once.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Links List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Generated Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {links.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Link2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500">No links generated yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {links.map((link) => {
                                        const isExpired = new Date(link.expiresAt) < new Date();
                                        const isCopied = copiedId === link.id;
                                        return (
                                            <div
                                                key={link.id}
                                                className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border transition-colors ${link.used
                                                    ? 'bg-emerald-50/50 border-emerald-200'
                                                    : isExpired
                                                        ? 'bg-red-50/50 border-red-200'
                                                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-medium text-slate-900">
                                                            {link.recipientName}
                                                        </span>
                                                        {link.used ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-emerald-100 text-emerald-700 border-emerald-200"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Used
                                                            </Badge>
                                                        ) : isExpired ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-red-100 text-red-700 border-red-200"
                                                            >
                                                                Expired
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-blue-100 text-blue-700 border-blue-200"
                                                            >
                                                                Active
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-500 mt-0.5">
                                                        {link.recipientEmail} · Created{' '}
                                                        {formatDate(link.createdAt)}
                                                    </p>
                                                </div>

                                                {!link.used && !isExpired && (
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => copyLink(link.token, link.id)}
                                                            className={`transition-all ${isCopied
                                                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                                                : ''
                                                                }`}
                                                        >
                                                            {isCopied ? (
                                                                <>
                                                                    <Check className="w-4 h-4 mr-1" />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-4 h-4 mr-1" />
                                                                    Copy Link
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => sendViaEmail(link.token, link.recipientName, link.recipientEmail)}
                                                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                                        >
                                                            <Mail className="w-4 h-4 mr-1" />
                                                            Send via Email
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
