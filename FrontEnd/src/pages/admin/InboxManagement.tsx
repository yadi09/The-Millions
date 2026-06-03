import { useState, type ReactNode } from 'react';
import { Mail, Search, Filter, Reply, Phone, Briefcase, Calendar, MessageSquare, Loader2, RefreshCcw, CheckCircle2, Bot, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useGetContactMessagesQuery, useUpdateContactMessageStatusMutation } from '../../features/api/apiSlice';
import type { ContactStatus, ContactSource } from '../../types/contact';

export const InboxManagement = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | ''>('');
  const [sourceFilter, setSourceFilter] = useState<ContactSource | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetContactMessagesQuery({
    page,
    limit,
    status: statusFilter !== '' ? statusFilter : undefined,
    source: sourceFilter !== '' ? sourceFilter : undefined,
    search: searchQuery !== '' ? searchQuery : undefined,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactMessageStatusMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
    setSelectedMessageId(null);
  };

  const handleStatusUpdate = async (id: string, newStatus: ContactStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Message marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update message status');
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
      
      {/* HEADER */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 h-auto md:h-24 py-4 md:py-0 z-[40]">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <div className="w-12 h-12 border border-millions-accent/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-millions-accent" />
          </div>
          <div>
            <h1 className="font-cormorant text-2xl md:text-3xl text-white font-light tracking-wider leading-none">
              Contact <em className="italic text-millions-accent not-italic">Inbox</em>
            </h1>
            <p className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.2em] mt-2">Manage Client Inquiries & Requests</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => refetch()} 
            className="w-11 h-11 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all shrink-0"
            title="Refresh Inbox"
          >
            <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          
          <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search emails, names..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-black/20 border border-white/10 text-white font-jost text-[0.8rem] h-11 pl-12 pr-4 focus:outline-none focus:border-millions-accent/50 focus:bg-white/5 transition-all"
            />
          </form>

          <div className="relative shrink-0">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ContactStatus | '');
                setPage(1);
                setSelectedMessageId(null);
              }}
              className="appearance-none bg-black/20 border border-white/10 text-white font-jost text-[0.8rem] h-11 pl-12 pr-10 focus:outline-none focus:border-millions-accent/50 hover:bg-white/5 transition-all cursor-pointer"
            >
              <option value="" className="bg-millions-dark">All Statuses</option>
              <option value="NEW" className="bg-millions-dark">New</option>
              <option value="PENDING_REVIEW" className="bg-millions-dark">Pending Review (AI)</option>
              <option value="READ" className="bg-millions-dark">Read</option>
              <option value="REPLIED" className="bg-millions-dark">Replied</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="relative shrink-0">
            <Bot className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value as ContactSource | '');
                setPage(1);
                setSelectedMessageId(null);
              }}
              className="appearance-none bg-black/20 border border-white/10 text-white font-jost text-[0.8rem] h-11 pl-12 pr-10 focus:outline-none focus:border-millions-accent/50 hover:bg-white/5 transition-all cursor-pointer"
            >
              <option value="" className="bg-millions-dark">All Sources</option>
              <option value="WEB_FORM" className="bg-millions-dark">Web Form</option>
              <option value="AI_AGENT" className="bg-millions-dark">AI Agent</option>
              <option value="MANUAL" className="bg-millions-dark">Manual</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT PANE - MESSAGE LIST */}
        <div className="w-full md:w-1/3 lg:w-[400px] border-r border-white/5 flex flex-col bg-black/10 overflow-hidden h-1/2 md:h-full">
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

        {/* RIGHT PANE - MESSAGE DETAILS */}
        <div className="flex-1 bg-black/30 flex flex-col h-1/2 md:h-full overflow-hidden border-t md:border-t-0 border-white/5">
          {selectedMessage ? (
            <div className="flex flex-col h-full overflow-hidden animate-fade-in">
              {/* Detail Header */}
              <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02] shrink-0">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                    <h2 className="font-cormorant text-3xl md:text-4xl text-white font-light mb-2">{selectedMessage.fullName}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-[0.75rem] font-jost text-white/50">
                      <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> <a href={`mailto:${selectedMessage.email}`} className="hover:text-millions-accent transition-colors">{selectedMessage.email}</a></div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> <a href={`tel:${selectedMessage.phone}`} className="hover:text-millions-accent transition-colors">{selectedMessage.phone}</a></div>
                      )}
                      <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(selectedMessage.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {selectedMessage.status === 'PENDING_REVIEW' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedMessage.id, 'NEW')}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-millions-dark text-[0.65rem] uppercase tracking-widest font-bold hover:bg-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move this AI-collected lead into the normal inbox"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Approve Lead
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusUpdate(selectedMessage.id, 'REPLIED')}
                      disabled={selectedMessage.status === 'REPLIED' || isUpdating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-millions-accent text-millions-dark text-[0.65rem] uppercase tracking-widest font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Reply className="w-3 h-3" />
                      Mark as Replied
                    </button>
                  </div>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10">
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
    </div>
  );
};

export default InboxManagement;
