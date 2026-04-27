import { useState, useEffect } from 'react';
import { useGetPageQuery, useUpdatePageMutation } from '../../../features/api/apiSlice';
import EditorSidebar from './EditorSidebar';
import SectionForm from './SectionForm';
import { Loader2, Save, Layout } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';
import type { Page, Section } from '../../../types';

interface PageEditorContentProps {
    slug: string;
    onClose?: () => void;
    isModal?: boolean;
}

const PageEditorContent = ({ slug, onClose, isModal = false }: PageEditorContentProps) => {
    const { data: pageData, isLoading, error } = useGetPageQuery(slug || '');
    const [updatePage, { isLoading: isSaving }] = useUpdatePageMutation();

    const [localPageData, setLocalPageData] = useState<Page | null>(null);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

    useEffect(() => {
        if (pageData && !localPageData) {
            setLocalPageData(pageData);
            if (pageData.sections?.length > 0 && !activeSectionId) {
                setActiveSectionId(pageData.sections[0].id);
            }
        }
    }, [pageData, localPageData, activeSectionId]);

    const handleSave = async () => {
        if (!localPageData?.id) {
            toast.error('Missing Page Identity. Please refresh.');
            return;
        }

        const promise = updatePage({
            id: localPageData.id,
            data: {
                title: localPageData.title,
                sections: localPageData.sections
            }
        }).unwrap();

        toast.promise(promise, {
            loading: 'Syncing Architecture...',
            success: (result: Page) => {
                setLocalPageData(result);
                return 'Architecture successfully synchronized.';
            },
            error: (err: any) => err?.data?.error || err?.data?.message || 'Sync failed.'
        });
    };

    const handleSectionUpdate = (sectionId: string, newContent: Record<string, any>) => {
        setLocalPageData((prev: Page | null) => {
            if (!prev) return null;
            return {
                ...prev,
                sections: prev.sections.map((s: Section) =>
                    s.id === sectionId ? { ...s, content: newContent } : s
                )
            };
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center p-12 bg-millions-dark">
                <Loader2 className="w-10 h-10 text-millions-accent animate-spin mb-6" />
                <p className="text-white/20 font-jost uppercase tracking-[0.25em] text-[0.6rem]">Syncing Architecture...</p>
            </div>
        );
    }

    if (error || !localPageData) {
        return (
            <div className="flex h-full items-center justify-center p-12 bg-millions-dark">
                <div className="text-center space-y-4">
                    <p className="font-cormorant text-2xl text-red-400 italic font-light">Interrupted. Check Path: ({slug})</p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="border-red-400/20 text-red-400 hover:bg-red-400/10 rounded-none uppercase text-[0.6rem] tracking-[0.2em] px-8">Reattempt Sync</Button>
                </div>
            </div>
        );
    }

    const activeSection = localPageData.sections?.find((s: any) => s.id === activeSectionId);

    return (
        <div className={`flex flex-col bg-millions-dark ${isModal ? 'h-[80vh]' : 'h-full'} animate-fade-in`}>
            {/* Header Redesign */}
            <div className={`
                bg-white/5 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 flex items-center justify-between shrink-0 z-30 sticky
                ${isModal ? 'top-0 py-6' : 'top-[57px] lg:top-0 h-24'}
            `}>
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex w-12 h-12 border border-millions-accent/10 items-center justify-center">
                        <Layout className="w-5 h-5 text-millions-accent/60" />
                    </div>
                    <div>
                        <h1 className="font-cormorant text-2xl md:text-3xl text-white font-light tracking-wider leading-none">
                            {slug === 'home' ? <>Home <em className="italic text-millions-accent not-italic">Architecture</em></> : <>{localPageData.name || slug} <em className="italic text-millions-accent not-italic">Refinement</em></>}
                        </h1>
                        <div className="flex items-center gap-3 mt-2 opacity-30 font-light">
                             <span className="text-[0.55rem] font-jost text-white uppercase tracking-[0.2em]">Ref: {localPageData.id}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {onClose && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onClose} 
                            className="bg-transparent text-white/20 hover:text-white rounded-none uppercase text-[0.65rem] tracking-[0.2em] h-10 px-6 transition-all"
                        >
                            Discard
                        </Button>
                    )}

                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !localPageData?.id}
                        className="bg-millions-accent text-millions-dark hover:bg-white rounded-none h-11 px-10 text-[0.7rem] uppercase tracking-[0.2em] font-bold shadow-xl transition-all"
                        size="sm"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span>Syncing...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                <span>Deploy Changes</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className={`flex flex-1 relative flex-col md:flex-row md:overflow-hidden ${isModal ? '' : 'pt-0'}`}>
                {/* Sidebar Navigation */}
                <div className={`sticky z-20 md:static md:w-80 border-r border-white/5 h-full`}>
                    <EditorSidebar
                        sections={localPageData.sections || []}
                        activeSectionId={activeSectionId}
                        onSelectSection={setActiveSectionId}
                    />
                </div>

                {/* Main Workspace Area */}
                <div className="flex-1 w-full p-6 md:p-12 md:overflow-y-auto custom-scrollbar bg-black/10">
                    <div className="max-w-4xl mx-auto pb-20 md:pb-0">
                        {activeSection ? (
                            <div className="bg-white/5 border border-white/5 backdrop-blur-md rounded-none p-8 md:p-12 shadow-2xl animate-fade-in-up">
                                <div className="mb-10 pb-8 border-b border-white/5">
                                     <div className="flex items-center gap-3 mb-3">
                                        <div className="w-1.5 h-1.5 bg-millions-accent/60" />
                                        <h2 className="font-cormorant text-2xl md:text-3xl text-white font-light tracking-wider leading-none italic">
                                            {activeSection.type.replace('-', ' ')} Refinement
                                        </h2>
                                    </div>
                                    <p className="text-[0.65rem] font-jost text-white/20 uppercase tracking-[0.2em] font-light">Refine Structural Component Properties</p>
                                </div>

                                <div className="animate-fade-in">
                                    <SectionForm
                                        key={activeSection.id}
                                        type={activeSection.type}
                                        content={activeSection.content}
                                        onChange={(newContent) => handleSectionUpdate(activeSection.id, newContent)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[50vh]">
                                <div className="w-12 h-12 border border-white/5 rounded-none flex items-center justify-center mb-6">
                                    <Layout className="w-6 h-6 text-white/5" />
                                </div>
                                <p className="font-cormorant text-2xl text-white/10 italic font-light">Awaiting structural selection.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageEditorContent;
