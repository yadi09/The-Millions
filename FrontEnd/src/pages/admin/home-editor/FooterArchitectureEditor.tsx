import { useState, useEffect } from 'react';
import { useGetPageQuery, useUpdatePageMutation } from '../../../features/api/apiSlice';
import { Loader2, CheckCircle2, Info, Mail, MapPin, Globe, Phone, Monitor } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { Page, Section } from '../../../types';
import { 
    DarkInput, 
    DarkTextarea, 
    FieldGroup, 
    ListManager, 
    FormSectionHeader
} from './EditorUI';
import { landingContent } from '../../../data/landingContent';


const FooterArchitectureEditor = () => {
    const { data: pageData, isLoading } = useGetPageQuery('global-footer');
    const [updatePage, { isLoading: isSaving, isSuccess }] = useUpdatePageMutation();

    const [localPageData, setLocalPageData] = useState<Page | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        if (!localPageData) {
            const mockPage: Page = {
                id: pageData?.id || 'temp-footer-id',
                slug: 'global-footer',
                title: 'Global Footer',
                sections: [
                    {
                        id: pageData?.sections?.find(s => s.type === 'contact')?.id || 'temp-contact',
                        type: 'contact',
                        content: pageData?.sections?.find(s => s.type === 'contact')?.content || (landingContent as any).contact || {}
                    },
                    {
                        id: pageData?.sections?.find(s => s.type === 'footer')?.id || 'temp-footer',
                        type: 'footer',
                        content: pageData?.sections?.find(s => s.type === 'footer')?.content || (landingContent as any).footer || {}
                    }
                ]
            };
            setLocalPageData(mockPage);
        }
    }, [pageData, localPageData]);

    useEffect(() => {
        if (isSuccess) {
            setShowSuccess(true);
            setSaveError(null);
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const handleSave = async () => {
        setSaveError(null);
        if (!localPageData?.id) {
            setSaveError('Missing Footer Architecture Identity.');
            return;
        }

        try {
            const result = await updatePage({
                id: localPageData.id,
                data: {
                    title: localPageData.title,
                    sections: localPageData.sections
                }
            }).unwrap();
            setLocalPageData(result);
        } catch (err: any) {
            setSaveError(err?.data?.message || 'Archival Sync failed.');
        }
    };

    const handleDiscard = () => {
        if (pageData) {
            setLocalPageData(pageData);
        }
    };

    const updateSection = (type: string, newContent: Record<string, any>) => {
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
                <p className="text-white/20 font-jost uppercase tracking-[0.3em] text-[0.7rem]">Syncing Global Footer...</p>
            </div>
        );
    }

    if (!localPageData) return null;

    const contactSection = localPageData.sections?.find(s => s.type === 'contact') || { type: 'contact', content: {} };
    const footerSection = localPageData.sections?.find(s => s.type === 'footer') || { type: 'footer', content: {} };

    const c: any = contactSection.content || {};
    const f: any = footerSection.content || {};

    const updateContact = (key: string, val: any) => updateSection('contact', { ...c, [key]: val });
    const updateFooter = (key: string, val: any) => updateSection('footer', { ...f, [key]: val });

    return (
        <div className="flex flex-col bg-millions-dark h-full animate-fade-in -m-6 md:-m-10">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 flex items-center justify-between shrink-0 h-24 sticky top-0 z-[40]">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 border border-millions-accent/10 flex items-center justify-center">
                        <Info className="w-5 h-5 text-millions-accent" />
                    </div>
                    <div>
                        <h1 className="font-cormorant text-2xl md:text-3xl text-white font-light tracking-wider leading-none">
                            Global <em className="italic text-millions-accent not-italic">Footer</em>
                        </h1>
                        <p className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.2em] mt-2">Shared Institutional Identity & Reach</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {showSuccess && (
                        <div className="hidden sm:flex items-center gap-2 text-millions-accent text-[0.65rem] font-jost uppercase tracking-[0.15em] mr-4">
                            <CheckCircle2 className="w-3" />
                            Archival Confirmed
                        </div>
                    )}

                    <Button variant="ghost" size="sm" onClick={handleDiscard} className="text-white/20 hover:text-white uppercase text-[0.65rem] tracking-[0.2em]">Discard</Button>

                    <Button onClick={handleSave} disabled={isSaving} className="bg-millions-accent text-millions-dark hover:bg-white rounded-none h-11 px-10 text-[0.7rem] uppercase tracking-[0.2em] font-bold">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Deploy Changes</span>}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/10">
                <div className="max-w-4xl mx-auto p-8 md:p-16 space-y-20 pb-40">
                    
                    {/* CONTACT INTERFACE */}
                    <div className="animate-fade-in">
                        <FormSectionHeader title="Contact Interface" icon={Mail} description="The primary engagement gateway." />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <FieldGroup label="Section Label"><DarkInput value={c.label || ''} onChange={e => updateContact('label', e.target.value)} /></FieldGroup>
                            <FieldGroup label="Main Title"><DarkInput value={c.title || ''} onChange={e => updateContact('title', e.target.value)} /></FieldGroup>
                        </div>
                        <FieldGroup label="Inquiry Sub-title"><DarkTextarea value={c.subTitle || ''} onChange={e => updateContact('subTitle', e.target.value)} /></FieldGroup>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-12 bg-white/[0.01] p-8 border border-white/5">
                            <div className="space-y-6">
                                <FieldGroup label="Official Email"><div className="flex gap-3"><Mail className="w-4 h-4 text-white/10 mt-3" /><DarkInput value={c.email || ''} onChange={e => updateContact('email', e.target.value)} /></div></FieldGroup>
                                <FieldGroup label="Institutional Website"><div className="flex gap-3"><Globe className="w-4 h-4 text-white/10 mt-3" /><DarkInput value={c.website || ''} onChange={e => updateContact('website', e.target.value)} /></div></FieldGroup>
                            </div>
                            <div className="space-y-6">
                                <FieldGroup label="Engagement Button"><DarkInput value={c.buttonText || ''} onChange={e => updateContact('buttonText', e.target.value)} /></FieldGroup>
                                <ListManager 
                                    label="Direct Lines"
                                    items={c.phones || []}
                                    onAdd={() => updateContact('phones', [...(c.phones || []), ''])}
                                    onRemove={(i) => updateContact('phones', c.phones.filter((_: any, idx: number) => idx !== i))}
                                    renderItem={(item, i) => (
                                        <div className="flex gap-3"><Phone className="w-3 h-3 text-white/10 mt-4" /><DarkInput value={item} onChange={e => { const p = [...c.phones]; p[i] = e.target.value; updateContact('phones', p); }} /></div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <ListManager 
                                label="Physical Presence (Address Lines)"
                                items={c.address || []}
                                onAdd={() => updateContact('address', [...(c.address || []), ''])}
                                onRemove={(i) => updateContact('address', c.address.filter((_: any, idx: number) => idx !== i))}
                                renderItem={(item, i) => (
                                    <div className="flex gap-3"><MapPin className="w-3 h-3 text-white/10 mt-4" /><DarkInput value={item} onChange={e => { const a = [...c.address]; a[i] = e.target.value; updateContact('address', a); }} /></div>
                                )}
                            />
                        </div>
                    </div>

                    {/* BASE FOOTER */}
                    <div className="animate-fade-in pt-20 border-t border-white/5">
                        <FormSectionHeader title="Base Architecture" icon={Monitor} description="Copyright and legal placement." />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FieldGroup label="Logo Text"><DarkInput value={f.logo || ''} onChange={e => updateFooter('logo', e.target.value)} /></FieldGroup>
                            <FieldGroup label="Copyright Notice"><DarkInput value={f.copyright || ''} onChange={e => updateFooter('copyright', e.target.value)} /></FieldGroup>
                            <FieldGroup label="Operating Location"><DarkInput value={f.location || ''} onChange={e => updateFooter('location', e.target.value)} /></FieldGroup>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FooterArchitectureEditor;
