import { 
    DarkInput, 
    DarkTextarea, 
    FieldGroup, 
    ListManager, 
    FormSectionHeader,
    FormLabel 
} from "./EditorUI";
import { useNavigate } from 'react-router-dom';
import { useGetServicesQuery } from '../../../features/api/apiSlice';
import { Monitor, Quote, Target, Star, Layers, Map, Users, Heart, FastForward, Loader2 } from "lucide-react";

// 1. HERO FORM
export function HeroForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });
    const updateStat = (idx: number, key: string, val: any) => {
        const stats = [...(c.stats || [])];
        stats[idx] = { ...stats[idx], [key]: val };
        update('stats', stats);
    };

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Hero Experience" icon={Monitor} description="The first architectural point of contact." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FieldGroup label="Header Label (Badge)">
                    <DarkInput value={c.badge || c.label || ''} onChange={e => update('badge', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Emphasized Title (Gold)">
                    <DarkInput value={c.headlineBlue || c.titleEm || ''} onChange={e => update('headlineBlue', e.target.value)} />
                </FieldGroup>
            </div>

            <FieldGroup label="Primary Headline (Black)">
                <DarkInput value={c.headlineBlack || c.title || ''} onChange={e => update('headlineBlack', e.target.value)} />
            </FieldGroup>

            <FieldGroup label="Subtext / Narrative">
                <DarkTextarea value={c.description || c.subText || ''} onChange={e => update('description', e.target.value)} />
            </FieldGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FieldGroup label="Primary CTA Label">
                    <DarkInput 
                        disabled
                        className="opacity-50 cursor-not-allowed"
                        value={typeof c.ctas?.[0] === 'object' ? c.ctas[0].label : (c.ctas?.[0] || c.primaryCta || '')} 
                        onChange={e => {
                            const newCtas = [...(c.ctas || [])];
                            if (typeof newCtas[0] === 'object') {
                                newCtas[0] = { ...newCtas[0], label: e.target.value };
                            } else {
                                newCtas[0] = e.target.value;
                            }
                            update('ctas', newCtas);
                        }} 
                    />
                </FieldGroup>
                <FieldGroup label="Ghost CTA Label">
                    <DarkInput 
                        disabled
                        className="opacity-50 cursor-not-allowed"
                        value={typeof c.ctas?.[1] === 'object' ? c.ctas[1].label : (c.ctas?.[1] || c.ghostCta || '')} 
                        onChange={e => {
                            const newCtas = [...(c.ctas || [])];
                            if (typeof newCtas[1] === 'object') {
                                newCtas[1] = { ...newCtas[1], label: e.target.value };
                            } else {
                                newCtas[1] = e.target.value;
                            }
                            update('ctas', newCtas);
                        }} 
                    />
                </FieldGroup>
            </div>

            <ListManager 
                label="Strategic Highlights (Locations & Pillars)"
                items={c.stats || []}
                addButtonLabel="Add Highlight"
                onAdd={(c.stats || []).length < 3 ? () => update('stats', [...(c.stats || []), { num: '', label: '' }]) : undefined}
                onRemove={(i) => update('stats', c.stats.filter((_: any, idx: number) => idx !== i))}
                onReorder={(newItems) => update('stats', newItems)}
                renderItem={(item, i) => (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-1">
                            <FormLabel>Value</FormLabel>
                            <DarkInput value={item.num || ''} onChange={e => updateStat(i, 'num', e.target.value)} placeholder="EX: 4 Pillars" />
                        </div>
                        <div className="sm:col-span-3">
                            <FormLabel>Description</FormLabel>
                            <DarkInput value={item.label || ''} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="EX: Advisory · Learning · Ventures" />
                        </div>
                    </div>
                )}
            />
        </div>
    );
}

// 2. PHILOSOPHY FORM
export function PhilosophyForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Founding Philosophy" icon={Quote} description="Articulate the inner conviction of the organization." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FieldGroup label="Section Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Internal Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
            </div>

            <ListManager 
                label="Narrative Paragraphs"
                items={c.paragraphs || []}
                addButtonLabel="Add Paragraph"
                onAdd={() => update('paragraphs', [...(c.paragraphs || []), ""])}
                onRemove={(i) => update('paragraphs', c.paragraphs.filter((_: any, idx: number) => idx !== i))}
                onReorder={(newItems) => update('paragraphs', newItems)}
                renderItem={(item, i) => (
                    <DarkTextarea 
                        value={item} 
                        onChange={e => {
                            const p = [...c.paragraphs];
                            p[i] = e.target.value;
                            update('paragraphs', p);
                        }} 
                        className="min-h-[100px]"
                    />
                )}
            />

            <FieldGroup label="Central Quote">
                <DarkTextarea value={c.quote || ''} onChange={e => update('quote', e.target.value)} className="italic border-millions-accent/10" />
            </FieldGroup>

            <FieldGroup label="Quote Attribution">
                <DarkInput value={c.attr || ''} onChange={e => update('attr', e.target.value)} />
            </FieldGroup>
        </div>
    );
}

// 3. CORE VALUES FORM
export function ValuesForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });
    const updateItem = (idx: number, key: string, val: any) => {
        const items = [...(c.items || [])];
        items[idx] = { ...items[idx], [key]: val };
        update('items', items);
    };

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Core Values" icon={Star} description="The MILLIONS Values Framework." />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FieldGroup label="Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Sub-title">
                    <DarkInput value={c.subTitle || ''} onChange={e => update('subTitle', e.target.value)} />
                </FieldGroup>
            </div>

            <ListManager 
                label="Value Items"
                items={c.items || []}
                onAdd={() => update('items', [...(c.items || []), { name: '', text: '' }])}
                onRemove={(i) => update('items', c.items.filter((_: any, idx: number) => idx !== i))}
                onReorder={(newItems) => update('items', newItems)}
                renderItem={(item, i) => (
                    <div className="space-y-4">
                        <FieldGroup label="Value Name">
                            <DarkInput value={item.name || ''} onChange={e => updateItem(i, 'name', e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Definition">
                            <DarkTextarea value={item.text || ''} onChange={e => updateItem(i, 'text', e.target.value)} className="min-h-[80px]" />
                        </FieldGroup>
                    </div>
                )}
            />
        </div>
    );
}

// 4. IMPACT MODEL FORM
export function ImpactModelForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });
    const updatePillar = (idx: number, key: string, val: any) => {
        const pillars = [...(c.pillars || [])];
        pillars[idx] = { ...pillars[idx], [key]: val };
        update('pillars', pillars);
    };

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Impact Model" icon={Layers} description="Four complementary pillars of integration." />
            
            <div className="space-y-6 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldGroup label="Label">
                        <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Title">
                        <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                    </FieldGroup>
                </div>
                <FieldGroup label="Operational Sub-title">
                    <DarkTextarea value={c.subTitle || ''} onChange={e => update('subTitle', e.target.value)} className="min-h-[80px]" />
                </FieldGroup>
            </div>

            <ListManager 
                label="Strategic Pillars"
                items={c.pillars || []}
                onReorder={(newItems) => update('pillars', newItems)}
                renderItem={(item, i) => (
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                        <div className="sm:col-span-1">
                            <FormLabel>Index</FormLabel>
                            <DarkInput value={item.num || ''} onChange={e => updatePillar(i, 'num', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <FormLabel>Pillar Name</FormLabel>
                            <DarkInput value={item.title || ''} onChange={e => updatePillar(i, 'title', e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <FormLabel>Strategic Content</FormLabel>
                            <DarkTextarea value={item.text || ''} onChange={e => updatePillar(i, 'text', e.target.value)} className="min-h-[80px]" />
                        </div>
                    </div>
                )}
            />
        </div>
    );
}

// 5. LEADERSHIP FORM
export function LeadershipForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });
    const updateLeader = (idx: number, key: string, val: any) => {
        const leaders = [...(c.leaders || [])];
        leaders[idx] = { ...leaders[idx], [key]: val };
        update('leaders', leaders);
    };

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Leadership & Governance" icon={Users} description="The human capital and technical expertise." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup label="Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
            </div>
            <FieldGroup label="Narrative Sub-title">
                <DarkTextarea value={c.subTitle || ''} onChange={e => update('subTitle', e.target.value)} className="min-h-[80px]" />
            </FieldGroup>

            <ListManager 
                label="Institutional Commitments"
                items={c.commitments || []}
                addButtonLabel="Add Commitment"
                onAdd={() => update('commitments', [...(c.commitments || []), ""])}
                onRemove={(i) => update('commitments', c.commitments.filter((_: any, idx: number) => idx !== i))}
                onReorder={(newItems) => update('commitments', newItems)}
                renderItem={(item, i) => (
                    <DarkInput 
                        value={item} 
                        onChange={e => {
                            const p = [...c.commitments];
                            p[i] = e.target.value;
                            update('commitments', p);
                        }} 
                    />
                )}
            />

            <ListManager 
                label="Governance Leaders"
                items={c.leaders || []}
                addButtonLabel="Add Leader"
                onAdd={() => update('leaders', [...(c.leaders || []), { name: '', role: '', creds: '', initials: '' }])}
                onRemove={(i) => update('leaders', c.leaders.filter((_: any, idx: number) => idx !== i))}
                onReorder={(newItems) => update('leaders', newItems)}
                renderItem={(item, i) => (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-1">
                            <FormLabel>Initials</FormLabel>
                            <DarkInput value={item.initials || ''} onChange={e => updateLeader(i, 'initials', e.target.value)} maxLength={2} />
                        </div>
                        <div className="sm:col-span-3 space-y-4">
                            <div>
                                <FormLabel>Full Name</FormLabel>
                                <DarkInput value={item.name || ''} onChange={e => updateLeader(i, 'name', e.target.value)} />
                            </div>
                            <div>
                                <FormLabel>Professional Credentials</FormLabel>
                                <DarkInput value={item.creds || ''} onChange={e => updateLeader(i, 'creds', e.target.value)} placeholder="EX: FCCA, MBA" />
                            </div>
                            <div>
                                <FormLabel>Institutional Role</FormLabel>
                                <DarkInput value={item.role || ''} onChange={e => updateLeader(i, 'role', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}

// 6. FUTURE VISION FORM
export function FutureVisionForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Future Platform Vision" icon={FastForward} description="Scalability and generational evolution." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup label="Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
            </div>
            <FieldGroup label="Visionary Sub-title">
                <DarkTextarea value={c.subTitle || ''} onChange={e => update('subTitle', e.target.value)} className="min-h-[80px]" />
            </FieldGroup>

            <ListManager 
                label="Strategic Growth Points"
                items={c.points || []}
                addButtonLabel="Add Strategic Point"
                onAdd={() => update('points', [...(c.points || []), ""])}
                onRemove={(i) => update('points', c.points.filter((_: any, idx: number) => idx !== i))}
                onReorder={(newItems) => update('points', newItems)}
                renderItem={(item, i) => (
                    <DarkTextarea 
                        value={item} 
                        onChange={e => {
                            const p = [...c.points];
                            p[i] = e.target.value;
                            update('points', p);
                        }} 
                        className="min-h-[80px]"
                    />
                )}
            />

            <FieldGroup label="Vision Closing Statement">
                <DarkTextarea value={c.footer || ''} onChange={e => update('footer', e.target.value)} />
            </FieldGroup>
        </div>
    );
}
// 7. OVERVIEW FORM
export function OverviewForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Company Overview" icon={Monitor} description="The institutional identity and presence." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup label="Section Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Section Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
            </div>

            <ListManager 
                label="Identity Narrative"
                items={c.paragraphs || []}
                addButtonLabel="Add Paragraph"
                onAdd={() => update('paragraphs', [...(c.paragraphs || []), ""])}
                onRemove={(i) => update('paragraphs', c.paragraphs.filter((_: any, idx: number) => idx !== i))}
                onReorder={(newItems) => update('paragraphs', newItems)}
                renderItem={(item, i) => (
                    <DarkTextarea 
                        value={item} 
                        onChange={e => {
                            const p = [...c.paragraphs];
                            p[i] = e.target.value;
                            update('paragraphs', p);
                        }} 
                        className="min-h-[100px]"
                    />
                )}
            />
        </div>
    );
}

// 8. MISSION & VISION FORM
export function MissionVisionForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });
    const updateSub = (sub: 'mission' | 'vision', key: string, val: any) => {
        update(sub, { ...c[sub], [key]: val });
    };

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Mission & Vision" icon={Target} description="Defining purpose and global ambition." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <FieldGroup label="Section Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Section Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
            </div>

            <div className="space-y-12">
                <div className="p-8 bg-white/[0.02] border border-white/5">
                    <FormLabel>The Mission</FormLabel>
                    <div className="space-y-4 mt-4">
                        <DarkInput value={c.mission?.label || ''} onChange={e => updateSub('mission', 'label', e.target.value)} placeholder="Mission Label" />
                        <DarkInput value={c.mission?.title || ''} onChange={e => updateSub('mission', 'title', e.target.value)} placeholder="Mission Title" />
                        <DarkTextarea value={c.mission?.text || ''} onChange={e => updateSub('mission', 'text', e.target.value)} placeholder="Mission Statement" />
                    </div>
                </div>

                <div className="p-8 bg-white/[0.02] border border-white/5">
                    <FormLabel>The Vision</FormLabel>
                    <div className="space-y-4 mt-4">
                        <DarkInput value={c.vision?.label || ''} onChange={e => updateSub('vision', 'label', e.target.value)} placeholder="Vision Label" />
                        <DarkInput value={c.vision?.title || ''} onChange={e => updateSub('vision', 'title', e.target.value)} placeholder="Vision Title" />
                        <DarkTextarea value={c.vision?.text || ''} onChange={e => updateSub('vision', 'text', e.target.value)} placeholder="Vision Statement" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// 9. SERVICES PLATFORM FORM
// 9. SERVICES PLATFORM FORM
export function ServicesForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });
    const navigate = useNavigate();
    
    // Fetch LIVE services from the database to show exactly what's on the public site
    const { data: liveServices, isLoading } = useGetServicesQuery();

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Professional Capability" icon={Layers} description="Technical advisory and learning initiatives." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <FieldGroup label="Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
            </div>

            <div className="mb-10 bg-black/20 border border-white/5 p-8">
                <div className="flex items-center justify-between mb-6">
                    <FormLabel>Service Architecture (LIVE Preview)</FormLabel>
                    <button 
                        onClick={() => navigate('/admin/services')}
                        className="text-[0.55rem] font-jost text-millions-accent uppercase tracking-widest bg-millions-accent/10 px-4 py-2 border border-millions-accent/20 hover:bg-millions-accent hover:text-millions-dark transition-all"
                    >
                        Manage Architectural Pillars
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5">
                        <Loader2 className="w-4 h-4 text-millions-accent animate-spin" />
                        <span className="text-white/20 font-jost text-[0.65rem] uppercase tracking-widest">Syncing Live Data...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {(liveServices || []).map((item: any, i: number) => (
                            <div key={i} className="flex flex-col gap-1 p-4 bg-white/[0.02] border border-white/5">
                                <span className="text-white/60 font-cormorant text-lg italic">{item.name}</span>
                                <span className="text-white/20 font-jost text-[0.65rem] uppercase tracking-widest truncate">{item.description}</span>
                            </div>
                        ))}
                        {(liveServices || []).length === 0 && (
                            <div className="p-4 bg-white/[0.02] border border-white/5 text-center">
                                <span className="text-white/20 font-jost text-[0.65rem] uppercase tracking-widest">No active domains in database.</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-[0.6rem] font-jost text-white/30 leading-relaxed italic">
                        <span className="text-millions-accent not-italic font-bold mr-2">ARCHITECTURE CONTROL:</span>
                        Service Pillars are managed exclusively via the 
                        <span className="text-white mx-1 font-bold">Services Management</span> 
                        interface. The view above is a live reflection of your public-facing architecture.
                    </p>
                </div>
            </div>

            <div className="mt-12 p-8 border border-millions-accent/10 bg-millions-accent/[0.02]">
                <FormLabel>Strategic Footer (Integrated Impact)</FormLabel>
                <div className="space-y-4">
                    <DarkInput 
                        value={c.footerTitle || c.subtitle || ''} 
                        onChange={e => update('footerTitle', e.target.value)} 
                        placeholder="Footer Title (Integrated Impact)" 
                    />
                    <DarkTextarea 
                        value={c.footerText || (c.footerTitle ? "" : (c.subtitle ? "" : ""))} 
                        onChange={e => update('footerText', e.target.value)} 
                        placeholder="Impact Narrative Summary" 
                    />
                </div>
            </div>
        </div>
    );
}

// 10. GEOGRAPHY FORM
export function GeographyForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });
    const updateRegion = (idx: number, key: string, val: any) => {
        const regions = [...(c.regions || [])];
        regions[idx] = { ...regions[idx], [key]: val };
        update('regions', regions);
    };

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="Geographic Focus" icon={Map} description="Operational presence and strategic growth." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldGroup label="Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
            </div>
            <FieldGroup label="Global Narrative">
                <DarkTextarea value={c.subTitle || ''} onChange={e => update('subTitle', e.target.value)} />
            </FieldGroup>

            <ListManager 
                label="Regional Architectures"
                items={c.regions || []}
                onAdd={() => update('regions', [...(c.regions || []), { label: '', title: '', subTitle: '', text: '', tags: [] }])}
                onRemove={(i) => update('regions', c.regions.filter((_: any, idx: number) => idx !== i))}
                onReorder={(newItems) => update('regions', newItems)}
                renderItem={(item, i) => (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DarkInput value={item.label || ''} onChange={e => updateRegion(i, 'label', e.target.value)} placeholder="Region Label (e.g. Advisory)" />
                            <DarkInput value={item.title || ''} onChange={e => updateRegion(i, 'title', e.target.value)} placeholder="Territory Name" />
                        </div>
                        <DarkInput value={item.subTitle || ''} onChange={e => updateRegion(i, 'subTitle', e.target.value)} placeholder="Strategic Descriptor" />
                        <DarkTextarea value={item.text || ''} onChange={e => updateRegion(i, 'text', e.target.value)} placeholder="Operational Narrative" />
                        <div>
                            <FormLabel>Capabilities (Comma Separated)</FormLabel>
                            <DarkInput 
                                value={(item.tags || []).join(', ')} 
                                onChange={e => updateRegion(i, 'tags', e.target.value.split(',').map(s => s.trim()))} 
                                placeholder="Global Standards, Advanced Expertise"
                            />
                        </div>
                    </div>
                )}
            />
        </div>
    );
}

// 11. SOCIAL IMPACT FORM
export function SocialImpactForm({ content, onChange }: { content: any, onChange: (c: any) => void }) {
    const c = content || {};
    const update = (key: string, val: any) => onChange({ ...c, [key]: val });
    const updateTier = (idx: number, key: string, val: any) => {
        const tiers = [...(c.tiers || [])];
        tiers[idx] = { ...tiers[idx], [key]: val };
        update('tiers', tiers);
    };

    return (
        <div className="animate-fade-in">
            <FormSectionHeader title="YeMillions Charity" icon={Heart} description="Three-tier social impact framework." />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <FieldGroup label="Label">
                    <DarkInput value={c.label || ''} onChange={e => update('label', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Title">
                    <DarkInput value={c.title || ''} onChange={e => update('title', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Impact Title">
                    <DarkInput value={c.subTitle || ''} onChange={e => update('subTitle', e.target.value)} />
                </FieldGroup>
            </div>

            <ListManager 
                label="Impact Tiers"
                items={c.tiers || []}
                onReorder={(newItems) => update('tiers', newItems)}
                renderItem={(item, i) => (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-1">
                            <FormLabel>Badge</FormLabel>
                            <DarkInput value={item.badge || ''} onChange={e => updateTier(i, 'badge', e.target.value)} />
                        </div>
                        <div className="sm:col-span-3 space-y-4">
                            <DarkInput value={item.title || ''} onChange={e => updateTier(i, 'title', e.target.value)} placeholder="Framework Title" />
                            <DarkTextarea value={item.text || ''} onChange={e => updateTier(i, 'text', e.target.value)} placeholder="Impact Narrative" />
                        </div>
                    </div>
                )}
            />

            <div className="mt-12 p-8 border border-white/10 bg-black/20">
                <FormLabel>Impact Governance</FormLabel>
                <div className="space-y-6">
                    <DarkInput value={c.governance?.title || ''} onChange={e => update('governance', { ...c.governance, title: e.target.value })} placeholder="Governance Heading" />
                    <ListManager 
                        label="Governance List"
                        items={c.governance?.list || []}
                        onAdd={() => update('governance', { ...c.governance, list: [...(c.governance?.list || []), ""] })}
                        onRemove={(i) => update('governance', { ...c.governance, list: c.governance.list.filter((_: any, idx: number) => idx !== i) })}
                        onReorder={(newItems) => update('governance', { ...c.governance, list: newItems })}
                        renderItem={(item, i) => (
                            <DarkInput 
                                value={item} 
                                onChange={e => {
                                    const l = [...c.governance.list];
                                    l[i] = e.target.value;
                                    update('governance', { ...c.governance, list: l });
                                }} 
                            />
                        )}
                    />
                    <DarkTextarea value={c.governance?.footer || ''} onChange={e => update('governance', { ...c.governance, footer: e.target.value })} placeholder="Governance Footer" />
                </div>
            </div>
        </div>
    );
}
