import { useState, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Search, Filter, Reply, Phone, Briefcase, Calendar, MessageSquare, Loader2, RefreshCcw, CheckCircle2, Bot, FileText, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useGetContactMessagesQuery, useUpdateContactMessageStatusMutation, useDeleteContactMessageMutation } from '../../features/api/apiSlice';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import type { ContactStatus, ContactSource } from '../../types/contact';

const VALID_STATUSES: ContactStatus[] = ['NEW', 'READ', 'REPLIED', 'PENDING_REVIEW'];
const VALID_SOURCES: ContactSource[] = ['WEB_FORM', 'AI_AGENT', 'MANUAL'];

export const InboxManagement = () => {
  // Filters live in the URL so a tab refresh / shared link preserves the
  // brothers' working state. The trade-off: state derives from search
  // params and is written back via setSearchParams.
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = (() => {
    const v = searchParams.get('status');
    return v && (VALID_STATUSES as string[]).includes(v) ? (v as ContactStatus) : '';
  })();
  const sourceFilter = (() => {
    const v = searchParams.get('source');
    return v && (VALID_SOURCES as string[]).includes(v) ? (v as ContactSource) : '';
  })();
  const searchQuery = searchParams.get('q') ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const [limit] = useState(20);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  // Keep the search input synced if the URL changes externally (e.g. back/forward nav)
  useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);

  // Helper: write one or more params, drop empty values, and reset page=1
  // automatically when a filter changes (unless caller is changing page).
  const updateParams = (patch: Record<string, string | null>, resetPage = true) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === '') next.delete(k);
        else next.set(k, v);
      }
      if (resetPage && !('page' in patch)) next.delete('page');
      return next;
    }, { replace: true });
    if (resetPage) setSelectedMessageId(null);
  };

  const setStatusFilter = (s: ContactStatus | '') => updateParams({ status: s || null });
  const setSourceFilter = (s: ContactSource | '') => updateParams({ source: s || null });
  const setPage = (p: number | ((prev: number) => number)) => {
    const nextPage = typeof p === 'function' ? p(page) : p;
    updateParams({ page: nextPage > 1 ? String(nextPage) : null }, false);
  };

  const { data, isLoading, isFetching, refetch } = useGetContactMessagesQuery({
    page,
    limit,
    status: statusFilter !== '' ? statusFilter : undefined,
    source: sourceFilter !== '' ? sourceFilter : undefined,
    search: searchQuery !== '' ? searchQuery : undefined,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactMessageStatusMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteContactMessageMutation();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  };

  const handleStatusUpdate = async (id: string, newStatus: ContactStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Message marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id).unwrap();
      toast.success('Lead deleted');
      setSelectedMessageId(null);
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const messages = data?.data || [];
  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case 'NEW': return 'text-millions-accent border-millions-accent/20 bg-millions-accent/10';
      case 'READ': return 'text-white/60 border-white/10 bg-white/5';
      case 'REPLIED': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10';
      case 'PENDING_REVIEW': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      default: return 'text-white/60 border-white/10 bg-white/5';
    }
  };

  // Order of metadata keys we want surfaced first in the detail panel.
  // Anything else in metadata gets rendered after in insertion order.
  const PRIORITY_METADATA_KEYS = [
    'serviceCategory',
    'urgency',
    'businessName',
    'businessType',
    'whatsappNumber',
    'preferredContactMethod',
    'agentConfidence',
    'conversationRef',
  ] as const;

  const formatMetadataKey = (key: string): string =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();

  const renderMetadataValue = (key: string, value: unknown): ReactNode => {
    if (value === null || value === undefined || value === '') return null;
    if (key === 'conversationRef' && typeof value === 'string') {
      return (
        <a href={value} target="_blank" rel="noreferrer" className="text-millions-accent hover:underline break-all">
          Open transcript ↗
        </a>
      );
    }
    if (key === 'agentConfidence' && typeof value === 'number') {
      const pct = Math.round(value * 100);
      const color = pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400';
      return <span className={`font-mono ${color}`}>{pct}%</span>;
    }
    return <span className="text-white/80 break-words">{String(value)}</span>;
  };

  return (
    <div className="flex flex-col bg-millions-dark h-[calc(100vh-theme(spacing.16))] md:h-screen -m-6 md:-m-10">
      
      {/* HEADER — hidden on mobile when a message is selected (master-detail nav) */}
      <div className={`bg-white/5 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 md:px-10 flex-col md:flex-row items-start md:items-center justify-between shrink-0 h-auto md:h-24 py-3 sm:py-4 md:py-0 z-[40] ${selectedMessageId ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-3 md:mb-0">
          <div className="w-10 h-10 md:w-12 md:h-12 border border-millions-accent/10 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-millions-accent" />
          </div>
          <div>
            <h1 className="font-cormorant text-xl sm:text-2xl md:text-3xl text-white font-light tracking-wider leading-none">
              Contact <em className="italic text-millions-accent not-italic">Inbox</em>
            </h1>
            <p className="hidden sm:block text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.2em] mt-2">Manage Client Inquiries & Requests</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={() => refetch()}
            className="w-11 h-11 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all shrink-0 order-2 sm:order-1"
            title="Refresh Inbox"
          >
            <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[180px] md:w-64 md:flex-initial order-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-black/20 border border-white/10 text-white font-jost text-[0.8rem] h-11 pl-12 pr-4 focus:outline-none focus:border-millions-accent/50 focus:bg-white/5 transition-all"
            />
          </form>

          <div className="relative flex-1 min-w-[140px] sm:flex-initial order-3 sm:order-2">
            <Filter className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ContactStatus | '');
                setPage(1);
                setSelectedMessageId(null);
              }}
              className="appearance-none w-full bg-black/20 border border-white/10 text-white font-jost text-[0.8rem] h-11 pl-10 sm:pl-12 pr-9 focus:outline-none focus:border-millions-accent/50 hover:bg-white/5 transition-all cursor-pointer"
            >
              <option value="" className="bg-millions-dark">All Statuses</option>
              <option value="NEW" className="bg-millions-dark">New</option>
              <option value="PENDING_REVIEW" className="bg-millions-dark">Pending (AI)</option>
              <option value="READ" className="bg-millions-dark">Read</option>
              <option value="REPLIED" className="bg-millions-dark">Replied</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="relative flex-1 min-w-[140px] sm:flex-initial order-4 sm:order-3">
            <Bot className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value as ContactSource | '');
                setPage(1);
                setSelectedMessageId(null);
              }}
              className="appearance-none w-full bg-black/20 border border-white/10 text-white font-jost text-[0.8rem] h-11 pl-10 sm:pl-12 pr-9 focus:outline-none focus:border-millions-accent/50 hover:bg-white/5 transition-all cursor-pointer"
            >
              <option value="" className="bg-millions-dark">All Sources</option>
              <option value="WEB_FORM" className="bg-millions-dark">Web Form</option>
              <option value="AI_AGENT" className="bg-millions-dark">AI Agent</option>
              <option value="MANUAL" className="bg-millions-dark">Manual</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT PANE — MESSAGE LIST. On mobile, hidden when a message is open
            (master-detail navigation). On md+, always visible alongside detail. */}
        <div className={`w-full md:w-1/3 lg:w-[400px] border-r border-white/5 flex-col bg-black/10 overflow-hidden h-full ${selectedMessageId ? 'hidden md:flex' : 'flex'}`}>
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <Loader2 className="w-8 h-8 text-millions-accent animate-spin mb-4" />
              <p className="text-[0.65rem] font-jost text-white/30 uppercase tracking-widest">Loading Inbox...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/60 font-jost text-sm mb-2">No messages found</p>
              <p className="text-white/30 font-jost text-[0.7rem]">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessageId(msg.id);
                    if (msg.status === 'NEW') {
                      handleStatusUpdate(msg.id, 'READ');
                    }
                  }}
                  className={`p-6 border-b border-white/5 cursor-pointer transition-all duration-300 relative group
                    ${selectedMessageId === msg.id ? 'bg-white/10 border-l-2 border-l-millions-accent' : 'hover:bg-white/5 border-l-2 border-l-transparent'}
                    ${msg.status === 'NEW' ? 'bg-millions-accent/[0.02]' : ''}
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-jost text-[0.95rem] truncate pr-4 ${msg.status === 'NEW' ? 'text-white font-medium' : 'text-white/80 font-light'}`}>
                      {msg.fullName}
                    </h3>
                    <span className="text-[0.6rem] text-white/40 whitespace-nowrap shrink-0 mt-1">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`text-[0.55rem] uppercase tracking-wider px-2 py-0.5 border ${getStatusColor(msg.status)}`}>
                      {msg.status === 'PENDING_REVIEW' ? 'Pending' : msg.status}
                    </span>
                    {msg.source === 'AI_AGENT' && (
                      <span className="text-[0.55rem] uppercase tracking-wider px-2 py-0.5 border border-violet-400/30 bg-violet-400/10 text-violet-300 inline-flex items-center gap-1">
                        <Bot className="w-2.5 h-2.5" /> AI
                      </span>
                    )}
                    {msg.service?.name && (
                      <span className="text-[0.65rem] text-millions-accent truncate max-w-[150px]">
                        {msg.service.name}
                      </span>
                    )}
                    {!msg.service?.name && msg.source === 'AI_AGENT' && (msg.metadata as any)?.serviceCategory && (
                      <span className="text-[0.65rem] text-violet-300/80 truncate max-w-[150px]">
                        {(msg.metadata as any).serviceCategory}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white/40 font-jost text-[0.75rem] line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {/* PAGINATION */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between shrink-0">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="text-[0.65rem] uppercase tracking-widest text-white/50 hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors"
              >
                Previous
              </button>
              <span className="text-[0.65rem] text-white/30">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button 
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="text-[0.65rem] uppercase tracking-widest text-white/50 hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANE — MESSAGE DETAILS. On mobile, takes the full viewport
            when a message is selected; hidden otherwise. */}
        <div className={`flex-1 bg-black/30 flex-col h-full overflow-hidden ${selectedMessageId ? 'flex' : 'hidden md:flex'}`}>
          {selectedMessage ? (
            <div className="flex flex-col h-full overflow-hidden animate-fade-in">
              {/* Mobile back bar — only on small screens, lets you return to the list */}
              <div className="md:hidden flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-millions-dark/60 backdrop-blur-xl shrink-0 sticky top-0 z-10">
                <button
                  onClick={() => setSelectedMessageId(null)}
                  className="flex items-center gap-2 text-white/70 hover:text-white font-jost text-[0.78rem] -ml-1 px-2 py-1 rounded-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Inbox
                </button>
                <span className={`text-[0.55rem] uppercase tracking-wider px-2 py-0.5 border ${getStatusColor(selectedMessage.status)}`}>
                  {selectedMessage.status === 'PENDING_REVIEW' ? 'Pending' : selectedMessage.status}
                </span>
              </div>

              {/* Detail Header */}
              <div className="p-6 sm:p-8 md:p-10 border-b border-white/5 bg-white/[0.02] shrink-0">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-5 lg:gap-6">
                  <div className="w-full lg:w-auto min-w-0">
                    <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-white font-light mb-2 break-words">{selectedMessage.fullName}</h2>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-[0.75rem] font-jost text-white/50">
                      <div className="flex items-center gap-2 min-w-0 max-w-full"><Mail className="w-3 h-3 shrink-0" /> <a href={`mailto:${selectedMessage.email}`} className="hover:text-millions-accent transition-colors truncate">{selectedMessage.email}</a></div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2"><Phone className="w-3 h-3 shrink-0" /> <a href={`tel:${selectedMessage.phone}`} className="hover:text-millions-accent transition-colors">{selectedMessage.phone}</a></div>
                      )}
                      <div className="flex items-center gap-2"><Calendar className="w-3 h-3 shrink-0" /> <span className="hidden sm:inline">{new Date(selectedMessage.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</span><span className="sm:hidden">{new Date(selectedMessage.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-stretch gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
                    {selectedMessage.status === 'PENDING_REVIEW' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedMessage.id, 'NEW')}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 flex-1 lg:flex-initial px-3 sm:px-5 py-2.5 bg-amber-400 text-millions-dark text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest font-bold hover:bg-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move this AI-collected lead into the normal inbox"
                      >
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span className="hidden sm:inline">Approve Lead</span>
                        <span className="sm:hidden">Approve</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusUpdate(selectedMessage.id, 'REPLIED')}
                      disabled={selectedMessage.status === 'REPLIED' || isUpdating}
                      className="flex items-center justify-center gap-2 flex-1 lg:flex-initial px-3 sm:px-5 py-2.5 bg-millions-accent text-millions-dark text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Reply className="w-3 h-3 shrink-0" />
                      <span className="hidden sm:inline">Mark as Replied</span>
                      <span className="sm:hidden">Reply</span>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteOpen(true)}
                      disabled={isDeleting || isUpdating}
                      title="Permanently delete this lead"
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 border border-rose-400/30 text-rose-300 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest font-bold hover:bg-rose-400/10 hover:border-rose-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Trash2 className="w-3 h-3 shrink-0" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-10">
                <div className="max-w-3xl">
                  <div className="mb-8 inline-flex items-center gap-3 px-4 py-3 bg-millions-accent/5 border border-millions-accent/20">
                    <Briefcase className="w-4 h-4 text-millions-accent" />
                    <span className="font-jost text-[0.75rem] text-white/80">Inquiry regarding: <strong className="text-white font-medium ml-1">{selectedMessage.service?.name ?? (selectedMessage.source === 'AI_AGENT' ? 'AI Agent submission' : 'No service specified')}</strong></span>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="font-jost text-[0.95rem] leading-relaxed text-white/70 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Metadata block — only renders when the lead has extra
                      structured info beyond the standard fields (typical of
                      AI-agent-collected leads). */}
                  {selectedMessage.metadata && typeof selectedMessage.metadata === 'object' && Object.keys(selectedMessage.metadata).length > 0 && (
                    <div className="mt-10 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3 mb-5">
                        <FileText className="w-4 h-4 text-violet-300" />
                        <h3 className="font-jost text-[0.7rem] uppercase tracking-[0.2em] text-violet-300/80">
                          Conversation Details
                        </h3>
                      </div>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-jost text-[0.8rem]">
                        {[
                          ...PRIORITY_METADATA_KEYS.filter(
                            (k) => (selectedMessage.metadata as Record<string, unknown>)[k] !== undefined &&
                                   (selectedMessage.metadata as Record<string, unknown>)[k] !== null &&
                                   (selectedMessage.metadata as Record<string, unknown>)[k] !== ''
                          ),
                          ...Object.keys(selectedMessage.metadata).filter(
                            (k) => !PRIORITY_METADATA_KEYS.includes(k as typeof PRIORITY_METADATA_KEYS[number])
                          ),
                        ].map((key) => {
                          const value = (selectedMessage.metadata as Record<string, unknown>)[key];
                          const rendered = renderMetadataValue(key, value);
                          if (rendered === null) return null;
                          return (
                            <div key={key} className="flex flex-col">
                              <dt className="text-[0.65rem] uppercase tracking-wider text-white/40 mb-1">
                                {formatMetadataKey(key)}
                              </dt>
                              <dd>{rendered}</dd>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/20">
              <div className="w-24 h-24 border border-white/5 flex items-center justify-center rounded-full mb-6 relative">
                <Mail className="w-8 h-8 text-white/10" />
                <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-millions-dark border border-white/10 flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-white/20" />
                </div>
              </div>
              <h2 className="font-cormorant text-2xl text-white/50 font-light mb-2">No Message Selected</h2>
              <p className="font-jost text-[0.8rem] text-white/30 max-w-xs">
                Select a message from the list to view its contents, reply, or update its status.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedMessage && (
        <ConfirmModal
          isOpen={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={() => handleDelete(selectedMessage.id)}
          title="Delete this lead?"
          message={`This will permanently remove ${selectedMessage.fullName}'s message from the database. This cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default InboxManagement;
