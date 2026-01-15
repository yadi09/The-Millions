import { useState, useEffect } from 'react';
import { useGetPageQuery, useUpdatePageMutation } from '../../../features/api/apiSlice';
import EditorSidebar from './EditorSidebar';
import SectionForm from './SectionForm';
import { Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { Page, Section } from '../../../types';

interface PageEditorContentProps {
    slug: string;
    onClose?: () => void;
    isModal?: boolean;
}

const PageEditorContent = ({ slug, onClose, isModal = false }: PageEditorContentProps) => {
    /**
     * Fetch page data using the slug
     * GET /pages/:slug - This is a public endpoint that returns page data
     * Response includes: { id, slug, title, sections: [...] }
     */
    const { data: pageData, isLoading, error } = useGetPageQuery(slug || '');

    /**
     * Update mutation for saving changes
     * PUT /admin/pages/:id - This is a protected endpoint that requires JWT
     */
    const [updatePage, { isLoading: isSaving, isSuccess }] = useUpdatePageMutation();

    // Local state to track edits before saving
    const [localPageData, setLocalPageData] = useState<Page | null>(null);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    /**
     * Sync local state when page data is fetched from backend
     * This ensures the form is populated with the latest data
     */
    useEffect(() => {
        if (pageData) {
            setLocalPageData(pageData);
            // Only set default active section if none is selected yet
            if (pageData.sections?.length > 0 && !activeSectionId) {
                setActiveSectionId(pageData.sections[0].id);
            }
        }
    }, [pageData]);

    // Handle success message visibility
    useEffect(() => {
        if (isSuccess) {
            setShowSuccess(true);
            setSaveError(null);
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    /**
     * Save handler - sends updates to backend
     * CRITICAL: Must use page.id, not slug
     * Backend route: PUT /admin/pages/:id
     * Payload: { title, sections }
     */
    const handleSave = async () => {
        setSaveError(null);
        if (!localPageData?.id) {
            setSaveError('Cannot save: Page ID is missing. Please refresh and try again.');
            return;
        }

        try {
            await updatePage({
                id: localPageData.id,
                data: {
                    title: localPageData.title,
                    sections: localPageData.sections
                }
            }).unwrap();

            // Note: Success state is handled by useEffect on isSuccess
        } catch (err: any) {
            // Provide detailed error feedback
            const errorMessage = err?.data?.message || 'Failed to save page. Please try again.';
            setSaveError(errorMessage);
        }
    };

    /**
     * Update a specific section's content in local state
     * This is called when the user edits form fields
     */
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

    // Loading state
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Error state
    if (error || !localPageData) {
        return (
            <div className="flex h-full items-center justify-center text-red-500 p-12">
                <div className="text-center">
                    <p className="font-semibold">Error loading page data</p>
                    <p className="text-sm mt-2">Please check the page slug ({slug}) and try again</p>
                </div>
            </div>
        );
    }

    // Find the currently active section for editing
    const activeSection = localPageData.sections?.find((s: any) => s.id === activeSectionId);

    return (
        <div className={`flex flex-col bg-slate-50 ${isModal ? 'h-[80vh]' : 'h-full'}`}>
            {/* Header with Save Button */}
            <div className={`
                bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-20 sticky top-0
                ${isModal ? 'py-4 rounded-t-xl' : 'h-16'}
            `}>
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="font-bold text-base md:text-lg text-slate-900 capitalize">{slug === 'home' ? (localPageData.title || 'Home Page') : localPageData.name || slug} Editor</h1>
                        <p className="text-xs text-slate-500 hidden sm:block">
                            {localPageData.id ? `Page ID: ${localPageData.id}` : 'Loading...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {showSuccess && (
                        <div className="hidden sm:flex items-center gap-2 text-green-600 text-sm font-medium mr-2 animate-in fade-in slide-in-from-right-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Saved Successfully
                        </div>
                    )}

                    {saveError && (
                        <div className="flex items-center gap-2 text-red-600 text-sm font-medium mr-2 animate-in fade-in slide-in-from-right-2">
                            <AlertCircle className="w-4 h-4" />
                            {saveError}
                        </div>
                    )}

                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose} className="mr-2">
                            Cancel
                        </Button>
                    )}

                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !localPageData?.id}
                        className="gap-2 h-9 md:h-10 text-sm"
                        size="sm"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span className="hidden sm:inline">Save Changes</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 relative flex-col md:flex-row md:overflow-hidden bg-slate-50">
                {/* Sidebar - Section Navigator */}
                <div className="sticky top-0 z-10 bg-white shadow-sm md:static md:shadow-none md:z-auto md:h-full">
                    <EditorSidebar
                        sections={localPageData.sections || []}
                        activeSectionId={activeSectionId}
                        onSelectSection={setActiveSectionId}
                    />
                </div>

                {/* Main Editor Area - Section Form */}
                <div className="flex-1 w-full p-4 md:p-8 md:overflow-y-auto">
                    <div className="max-w-3xl mx-auto pb-20 md:pb-0">
                        {activeSection ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                                <div className="mb-6 pb-6 border-b border-slate-100">
                                    <h2 className="text-lg md:text-xl font-bold text-slate-900 capitalize">
                                        {activeSection.type.replace('-', ' ')}
                                    </h2>
                                    <p className="text-sm text-slate-500">Edit the content for this section</p>
                                </div>

                                <SectionForm
                                    key={activeSection.id}
                                    type={activeSection.type}
                                    content={activeSection.content}
                                    onChange={(newContent) => handleSectionUpdate(activeSection.id, newContent)}
                                />
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 mt-20">
                                Select a section to start editing
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageEditorContent;
