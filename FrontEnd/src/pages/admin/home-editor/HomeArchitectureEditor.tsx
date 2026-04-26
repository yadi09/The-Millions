import { useState, useEffect } from 'react';
import { useGetPageQuery, useUpdatePageMutation } from '../../../features/api/apiSlice';
import { Loader2, ChevronRight, Monitor } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';
import type { Page, Section } from '../../../types';
import { 
    HeroForm, 
    PhilosophyForm, 
    OverviewForm,
    MissionVisionForm,
    ValuesForm, 
    ImpactModelForm, 
    ServicesForm,
    GeographyForm,
    SocialImpactForm,
    LeadershipForm, 
    FutureVisionForm 
} from './HomeForms';
import { landingContent } from '../../../data/landingContent';

const HOME_ARCHITECTURE_STRUCTURE = [
    { type: 'hero', label: 'Section 01: Hero' },
    { type: 'philosophy', label: 'Section 02: Philosophy' },
    { type: 'overview', label: 'Section 03: Overview' },
    { type: 'mission-vision', label: 'Section 04: Mission & Vision' },
    { type: 'values', label: 'Section 05: Values' },
    { type: 'impact-model', label: 'Section 06: Impact Model' },
    { type: 'services', label: 'Section 07: Services' },
    { type: 'geography', label: 'Section 08: Geography' },
    { type: 'social-impact', label: 'Section 09: Social Impact' },
    { type: 'leadership', label: 'Section 10: Leadership' },
    { type: 'future-vision', label: 'Section 11: Future Vision' }
];

const HomeArchitectureEditor = () => {
    const { data: pageData, isLoading, error } = useGetPageQuery('home');
    const [updatePage, { isLoading: isSaving }] = useUpdatePageMutation();

    const [localPageData, setLocalPageData] = useState<Page | null>(null);
    const [activeSectionType, setActiveSectionType] = useState<string>('hero');

    useEffect(() => {
        if (!localPageData) {
            // Force a full 11-section architecture record
            const mockPage: Page = {
                id: pageData?.id || 'temp-home-id',
                slug: 'home',
                title: 'Home',
                sections: HOME_ARCHITECTURE_STRUCTURE.map((struct) => {
                    // Find existing backend section or use landingContent fallback
                    const existingSection = pageData?.sections?.find(s => s.type === struct.type);
                    
                    // Map camelCase landingContent keys to kebab-case section types
                    const contentKey = struct.type === 'mission-vision' ? 'missionVision' 
                                   : struct.type === 'impact-model' ? 'impactModel'
                                   : struct.type === 'social-impact' ? 'socialImpact'
                                   : struct.type === 'future-vision' ? 'futureVision'
                                   : struct.type;

                    return {
                        id: existingSection?.id || `temp-${struct.type}`,
                        type: struct.type,
                        content: existingSection?.content || (landingContent as any)[contentKey] || {}
                    };
                })
            };
            setLocalPageData(mockPage);
        }
    }, [pageData, localPageData]);

    const handleSave = async () => {
        if (!localPageData?.id) {
            toast.error('Missing Architecture Identity.');
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
            loading: 'Deploying Architecture...',
            success: (result: Page) => {
                setLocalPageData(result);
                return 'Architecture successfully synchronized.';
            },
            error: (err: any) => err?.data?.error || err?.data?.message || 'Sync failed. Please verify your connection.'
        });
    };

    const handleDiscard = () => {
        if (pageData) {
            setLocalPageData(pageData);
        }
    };

    const handleSectionUpdate = (type: string, newContent: Record<string, any>) => {
        setLocalPageData((prev: Page | null) => {
            if (!prev) return null;
            return {
                ...prev,
                sections: prev.sections.map((s: Section) =>
                    s.type === type ? { ...s, content: newContent } : s
                )
            };
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center p-12 bg-millions-dark">
                <Loader2 className="w-12 h-12 text-millions-accent animate-spin mb-6" />
                <p className="text-white/20 font-jost uppercase tracking-[0.3em] text-[0.7rem]">Syncing Home Architecture...</p>
            </div>
        );
    }

    if (error || !localPageData) {
        return (
            <div className="flex h-[60vh] items-center justify-center p-12 bg-millions-dark">
                <div className="text-center space-y-4">
                    <p className="font-cormorant text-2xl text-red-400 italic font-light">Architecture Unreachable.</p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="border-red-400/20 text-red-400 hover:bg-red-400/10 rounded-none uppercase text-[0.6rem] tracking-[0.2em] px-8">Reattempt Sync</Button>
                </div>
            </div>
        );
    }

    if (!localPageData) return null;

    const activeSection = localPageData.sections?.find((s: Section) => s.type === activeSectionType);
    if (!activeSection) return null;

    const renderActiveForm = () => {
        if (!activeSection) return <div className="p-20 text-white/5 font-cormorant text-3xl italic">Select a structural block to refine.</div>;

        const commonProps = {
            content: activeSection.content,
            onChange: (newContent: any) => handleSectionUpdate(activeSection.type, newContent)
        };

        switch (activeSection.type) {
            case 'hero': return <HeroForm {...commonProps} />;
            case 'philosophy': return <PhilosophyForm {...commonProps} />;
            case 'overview': return <OverviewForm {...commonProps} />;
            case 'mission-vision': return <MissionVisionForm {...commonProps} />;
            case 'values': return <ValuesForm {...commonProps} />;
            case 'impact-model': return <ImpactModelForm {...commonProps} />;
            case 'services': return <ServicesForm {...commonProps} />;
            case 'geography': return <GeographyForm {...commonProps} />;
            case 'social-impact': return <SocialImpactForm {...commonProps} />;
            case 'leadership': return <LeadershipForm {...commonProps} />;
            case 'future-vision': return <FutureVisionForm {...commonProps} />;
            default:
                return (
                    <div className="p-12 border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center">
                        <h3 className="font-cormorant text-2xl text-white/20 italic mb-2 capitalize">Structural Block: "{activeSection.type}"</h3>
                        <p className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.3em]">Refinement module coming soon for this specific architecture.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col bg-millions-dark h-full animate-fade-in -m-6 md:-m-10">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 flex items-center justify-between shrink-0 h-24 sticky top-0 z-[40]">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 border border-millions-accent/10 items-center justify-center hidden sm:flex">
                        <Monitor className="w-5 h-5 text-millions-accent" />
                    </div>
                    <div>
                        <h1 className="font-cormorant text-2xl md:text-3xl text-white font-light tracking-wider leading-none">
                            Home <em className="italic text-millions-accent not-italic">Architecture</em>
                        </h1>
                        <p className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.2em] mt-2">Unified Central Refinement Console</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleDiscard} 
                        className="bg-transparent text-white/20 hover:text-white rounded-none uppercase text-[0.65rem] tracking-[0.2em] h-10 px-6 transition-all"
                    >
                        Discard Changes
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-millions-accent text-millions-dark hover:bg-white rounded-none h-11 px-10 text-[0.7rem] uppercase tracking-[0.2em] font-bold shadow-xl transition-all"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Deploy Changes</span>}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 flex-col md:flex-row overflow-hidden h-[calc(100vh-10rem)]">
                {/* Left Sidebar */}
                <div className="w-full md:w-80 border-r border-white/5 bg-black/20 overflow-y-auto custom-scrollbar">
                    <div className="p-6">
                        <p className="text-[0.55rem] font-jost text-white/20 uppercase tracking-[0.3em] font-medium mb-6 ml-2">Structural Flow</p>
                        <div className="space-y-1">
                            {HOME_ARCHITECTURE_STRUCTURE.map(section => (
                                <button
                                    key={section.type}
                                    onClick={() => setActiveSectionType(section.type)}
                                    className={`w-full flex items-center justify-between p-4 text-left transition-all group ${
                                        activeSectionType === section.type 
                                        ? 'bg-millions-accent/10 border-l-2 border-millions-accent' 
                                        : 'hover:bg-white/[0.03] border-l-2 border-transparent'
                                    }`}
                                >
                                    <span className={`text-[0.65rem] font-jost uppercase tracking-[0.25em] transition-colors ${
                                        activeSectionType === section.type ? 'text-white' : 'text-white/30 group-hover:text-white/60'
                                    }`}>
                                        {section.label}
                                    </span>
                                    <ChevronRight size={14} className={`transition-all ${
                                        activeSectionType === section.type ? 'text-millions-accent opacity-100' : 'text-white/5 opacity-0 group-hover:opacity-100'
                                    }`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/10">
                    <div className="max-w-4xl mx-auto p-8 md:p-16 pb-32">
                        {renderActiveForm()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeArchitectureEditor;
