import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useGetBlogPostsQuery } from "../../../features/api/apiSlice";

type SectionFormProps = {
  type: string;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

// Inline forms for each known section type based on prisma/seed.ts
// 1) HERO
function HeroForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const ctas = Array.isArray(c.ctas) ? c.ctas : [];
  const features = Array.isArray(c.features) ? c.features : [];

  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addCta = () => update("ctas", [...ctas, { label: "", action: "" }]);
  const updateCta = (idx: number, key: string, value: string) => {
    const next = ctas.map((item: any, i: number) => (i === idx ? { ...item, [key]: value } : item));
    update("ctas", next);
  };
  const removeCta = (idx: number) => update("ctas", ctas.filter((_: any, i: number) => i !== idx));

  const addFeature = () => update("features", [...features, ""]);
  const updateFeature = (idx: number, value: string) => {
    const next = features.map((f: string, i: number) => (i === idx ? value : f));
    update("features", next);
  };
  const removeFeature = (idx: number) => update("features", features.filter((_: any, i: number) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Badge</label>
          <Input value={c.badge || ""} onChange={(e) => update("badge", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Headline (Black)</label>
          <Input value={c.headlineBlack || ""} onChange={(e) => update("headlineBlack", e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Headline (Blue)</label>
        <Input value={c.headlineBlue || ""} onChange={(e) => update("headlineBlue", e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <Textarea value={c.description || ""} onChange={(e) => update("description", e.target.value)} rows={3} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">CTAs ({ctas.length})</h3>
          <Button size="sm" className="gap-2" onClick={addCta}><Plus size={16} /> Add CTA</Button>
        </div>
        <div className="space-y-3">
          {ctas.map((cta: any, idx: number) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2.5 sm:p-3 border rounded-lg bg-white">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">Label</label>
                <Input value={cta.label || ""} onChange={(e) => updateCta(idx, "label", e.target.value)} className="h-8 md:h-9 text-xs sm:text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">Action</label>
                <Input value={cta.action || ""} onChange={(e) => updateCta(idx, "action", e.target.value)} placeholder="e.g. book_consultation" className="h-8 md:h-9 text-xs sm:text-sm" />
              </div>
              <div className="flex items-end justify-end md:justify-start">
                <Button variant="ghost" size="icon" onClick={() => removeCta(idx)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Features ({features.length})</h3>
          <Button size="sm" className="gap-2" onClick={addFeature}><Plus size={16} /> Add Feature</Button>
        </div>
        <div className="space-y-3">
          {features.map((f: string, idx: number) => (
            <div key={idx} className="grid grid-cols-[1fr_auto] gap-2 p-2 sm:p-3 border rounded-lg bg-white">
              <Input value={f || ""} onChange={(e) => updateFeature(idx, e.target.value)} className="h-8 md:h-9 text-xs sm:text-sm" />
              <Button variant="ghost" size="icon" onClick={() => removeFeature(idx)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2) SERVICES
function ServicesForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const cards = Array.isArray(c.cards) ? c.cards : [];
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addCard = () => update("cards", [...cards, { id: "", icon: "", title: "", description: "" }]);
  const updateCard = (idx: number, key: string, value: string) => {
    const next = cards.map((item: any, i: number) => (i === idx ? { ...item, [key]: value } : item));
    update("cards", next);
  };
  const removeCard = (idx: number) => update("cards", cards.filter((_: any, i: number) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Section Title</label>
        <Input value={c.title || ""} onChange={(e) => update("title", e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Section Subtitle</label>
        <Textarea value={c.subtitle || ""} onChange={(e) => update("subtitle", e.target.value)} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Cards ({cards.length})</h3>
          <Button size="sm" className="gap-2" onClick={addCard}><Plus size={16} /> Add Card</Button>
        </div>
        <div className="space-y-3">
          {cards.map((item: any, idx: number) => (
            <div key={idx} className="p-2.5 sm:p-4 border rounded-lg bg-white space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-600">ID</label>
                  <Input value={item.id || ""} onChange={(e) => updateCard(idx, "id", e.target.value)} placeholder="unique_id" className="h-8 md:h-9 text-xs sm:text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-600">Icon</label>
                  <Input value={item.icon || ""} onChange={(e) => updateCard(idx, "icon", e.target.value)} placeholder="e.g. tax" className="h-8 md:h-9 text-xs sm:text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-600">Title</label>
                  <Input value={item.title || ""} onChange={(e) => updateCard(idx, "title", e.target.value)} className="h-8 md:h-9 text-xs sm:text-sm" />
                </div>
                <div className="flex items-end justify-end md:justify-start">
                  <Button variant="ghost" size="icon" onClick={() => removeCard(idx)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></Button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">Description</label>
                <Textarea value={item.description || ""} onChange={(e) => updateCard(idx, "description", e.target.value)} rows={2} className="text-xs sm:text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">View All Action</label>
        <Input value={c.viewAllAction || ""} onChange={(e) => update("viewAllAction", e.target.value)} placeholder="services_page" />
      </div>
    </div>
  );
}

// 3) ABOUT
function AboutForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const description = Array.isArray(c.description) ? c.description : [];
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addLine = () => update("description", [...description, ""]);
  const updateLine = (idx: number, value: string) => {
    const next = description.map((line: string, i: number) => (i === idx ? value : line));
    update("description", next);
  };
  const removeLine = (idx: number) => update("description", description.filter((_: any, i: number) => i !== idx));

  const action = c.action || { label: "", link: "" };
  const updateAction = (key: string, value: string) => update("action", { ...action, [key]: value });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Title</label>
        <Input value={c.title || ""} onChange={(e) => update("title", e.target.value)} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Description Lines ({description.length})</h3>
          <Button size="sm" className="gap-2" onClick={addLine}><Plus size={16} /> Add Line</Button>
        </div>
        <div className="space-y-3">
          {description.map((line: string, idx: number) => (
            <div key={idx} className="grid grid-cols-[1fr_auto] gap-2 p-2 sm:p-3 border rounded-lg bg-white">
              <Textarea rows={2} value={line || ""} onChange={(e) => updateLine(idx, e.target.value)} className="text-xs sm:text-sm" />
              <Button variant="ghost" size="icon" onClick={() => removeLine(idx)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Action Label</label>
          <Input value={action.label || ""} onChange={(e) => updateAction("label", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Action Link</label>
          <Input value={action.link || ""} onChange={(e) => updateAction("link", e.target.value)} placeholder="/about" />
        </div>
      </div>
    </div>
  );
}

// 4) STATS - uses 'stats' array per backend seed
function StatsForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const stats = Array.isArray(c.stats) ? c.stats : [];
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addStat = () => update("stats", [...stats, { label: "", value: "" }]);
  const updateStat = (idx: number, key: string, value: string) => {
    const next = stats.map((item: any, i: number) => (i === idx ? { ...item, [key]: value } : item));
    update("stats", next);
  };
  const removeStat = (idx: number) => update("stats", stats.filter((_: any, i: number) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Stats ({stats.length})</h3>
        <Button size="sm" className="gap-2" onClick={addStat}><Plus size={16} /> Add Stat</Button>
      </div>
      <div className="space-y-3">
        {stats.map((stat: any, idx: number) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg bg-white">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Value</label>
              <Input value={stat.value || ""} onChange={(e) => updateStat(idx, "value", e.target.value)} placeholder="e.g. 500+" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Label</label>
              <Input value={stat.label || ""} onChange={(e) => updateStat(idx, "label", e.target.value)} placeholder="e.g. Clients Served" />
            </div>
            <div className="flex items-end justify-end md:justify-start">
              <Button variant="ghost" size="icon" onClick={() => removeStat(idx)} className="text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={18} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4b) WHO WE ARE - for About page
function WhoWeAreForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Title</label>
        <Input value={c.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="Who We Are" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <Textarea
          value={c.description || ""}
          onChange={(e) => update("description", e.target.value)}
          rows={6}
          placeholder="Use double line breaks (press Enter twice) to separate paragraphs..."
        />
        <p className="text-xs text-slate-500">Tip: Use double line breaks to create separate paragraphs</p>
      </div>
    </div>
  );
}

// 4c) VALUES - vision, mission, and values array for About page
function ValuesForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const values = Array.isArray(c.values) ? c.values : [];
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addValue = () => update("values", [...values, { title: "", description: "" }]);
  const updateValue = (idx: number, key: string, value: string) => {
    const next = values.map((v: any, i: number) => (i === idx ? { ...v, [key]: value } : v));
    update("values", next);
  };
  const removeValue = (idx: number) => update("values", values.filter((_: any, i: number) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Vision</label>
        <Textarea
          value={c.vision || ""}
          onChange={(e) => update("vision", e.target.value)}
          rows={3}
          placeholder="Our vision statement..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Mission</label>
        <Textarea
          value={c.mission || ""}
          onChange={(e) => update("mission", e.target.value)}
          rows={3}
          placeholder="Our mission statement..."
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Core Values ({values.length})</h3>
          <Button size="sm" className="gap-2" onClick={addValue}><Plus size={16} /> Add Value</Button>
        </div>
        <div className="space-y-3">
          {values.map((v: any, idx: number) => (
            <div key={idx} className="p-4 border rounded-lg bg-white space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Title</label>
                  <Input value={v.title || ""} onChange={(e) => updateValue(idx, "title", e.target.value)} placeholder="e.g. Integrity" />
                </div>
                <div className="flex items-end">
                  <Button variant="ghost" size="icon" onClick={() => removeValue(idx)} className="text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={18} /></Button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Description</label>
                <Textarea value={v.description || ""} onChange={(e) => updateValue(idx, "description", e.target.value)} rows={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4d) TEAM - for About page
function TeamForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const members = Array.isArray(c.members) ? c.members : [];
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addMember = () => update("members", [...members, { name: "", role: "", qualifications: "", bio: "", image: "" }]);
  const updateMember = (idx: number, key: string, value: string) => {
    const next = members.map((m: any, i: number) => (i === idx ? { ...m, [key]: value } : m));
    update("members", next);
  };
  const removeMember = (idx: number) => update("members", members.filter((_: any, i: number) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Section Title</label>
        <Input value={c.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="Meet Our Team" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Section Subtitle</label>
        <Textarea value={c.subtitle || ""} onChange={(e) => update("subtitle", e.target.value)} rows={2} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Team Members ({members.length})</h3>
          <Button size="sm" className="gap-2" onClick={addMember}><Plus size={16} /> Add Member</Button>
        </div>
        <div className="space-y-4">
          {members.map((member: any, idx: number) => (
            <div key={idx} className="p-4 border rounded-lg bg-white space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Name</label>
                  <Input value={member.name || ""} onChange={(e) => updateMember(idx, "name", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Role</label>
                  <Input value={member.role || ""} onChange={(e) => updateMember(idx, "role", e.target.value)} placeholder="e.g. Accountant" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Qualifications</label>
                  <Input value={member.qualifications || ""} onChange={(e) => updateMember(idx, "qualifications", e.target.value)} placeholder="e.g. ACCA, MBA" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Image URL</label>
                <Input value={member.image || ""} onChange={(e) => updateMember(idx, "image", e.target.value)} placeholder="/team/member.jpg or https://..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Bio</label>
                <Textarea value={member.bio || ""} onChange={(e) => updateMember(idx, "bio", e.target.value)} rows={2} />
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => removeMember(idx)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 gap-1"><Trash2 size={16} /> Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5) WHY CHOOSE US
function WhyChooseUsForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const reasons = Array.isArray(c.reasons) ? c.reasons : [];
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addReason = () => update("reasons", [...reasons, { icon: "", title: "", description: "" }]);
  const updateReason = (idx: number, key: string, value: string) => {
    const next = reasons.map((r: any, i: number) => (i === idx ? { ...r, [key]: value } : r));
    update("reasons", next);
  };
  const removeReason = (idx: number) => update("reasons", reasons.filter((_: any, i: number) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Title</label>
        <Input value={c.title || ""} onChange={(e) => update("title", e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Subtitle</label>
        <Textarea value={c.subtitle || ""} onChange={(e) => update("subtitle", e.target.value)} />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Reasons ({reasons.length})</h3>
        <Button size="sm" className="gap-2" onClick={addReason}><Plus size={16} /> Add Reason</Button>
      </div>
      <div className="space-y-3">
        {reasons.map((reason: any, idx: number) => (
          <div key={idx} className="p-2.5 sm:p-4 border rounded-lg bg-white space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">Icon</label>
                <Input value={reason.icon || ""} onChange={(e) => updateReason(idx, "icon", e.target.value)} placeholder="e.g. acca" className="h-8 md:h-9 text-xs sm:text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">Title</label>
                <Input value={reason.title || ""} onChange={(e) => updateReason(idx, "title", e.target.value)} className="h-8 md:h-9 text-xs sm:text-sm" />
              </div>
              <div className="flex items-end justify-end md:justify-start">
                <Button variant="ghost" size="icon" onClick={() => removeReason(idx)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></Button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">Description</label>
              <Textarea value={reason.description || ""} onChange={(e) => updateReason(idx, "description", e.target.value)} rows={2} className="text-xs sm:text-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6) CTA
function CTAForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const actions = Array.isArray(c.actions) ? c.actions : [];
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addAction = () => update("actions", [...actions, { label: "", action: "" }]);
  const updateAction = (idx: number, key: string, value: string) => {
    const next = actions.map((a: any, i: number) => (i === idx ? { ...a, [key]: value } : a));
    update("actions", next);
  };
  const removeAction = (idx: number) => update("actions", actions.filter((_: any, i: number) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Title</label>
        <Input value={c.title || ""} onChange={(e) => update("title", e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Subtitle</label>
        <Textarea value={c.subtitle || ""} onChange={(e) => update("subtitle", e.target.value)} />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Actions ({actions.length})</h3>
        <Button size="sm" className="gap-2" onClick={addAction}><Plus size={16} /> Add Action</Button>
      </div>
      <div className="space-y-3">
        {actions.map((a: any, idx: number) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2.5 sm:p-3 border rounded-lg bg-white">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">Label</label>
              <Input value={a.label || ""} onChange={(e) => updateAction(idx, "label", e.target.value)} className="h-8 md:h-9 text-xs sm:text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">Action</label>
              <Input value={a.action || ""} onChange={(e) => updateAction(idx, "action", e.target.value)} placeholder="e.g. whatsapp" className="h-8 md:h-9 text-xs sm:text-sm" />
            </div>
            <div className="flex items-end justify-end md:justify-start">
              <Button variant="ghost" size="icon" onClick={() => removeAction(idx)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7) FEATURED POSTS (Blog)
function FeaturedPostsForm({ content, onChange, blogPosts, isLoading }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void; blogPosts: any[]; isLoading: boolean }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Section Title</label>
        <Input value={c.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Editor's Pick" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Select Featured Post</label>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading posts...
          </div>
        ) : (
          <select
            value={c.featuredPostId || ""}
            onChange={(e) => update("featuredPostId", e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Select a post...</option>
            {blogPosts.map((post: any) => (
              <option key={post.id} value={post.id}>
                {post.title} ({post.status})
              </option>
            ))}
          </select>
        )}
        <p className="text-xs text-muted-foreground">The selected post will be highlighted at the top of the blog page.</p>
      </div>
    </div>
  );
}

// 8) POPULAR POSTS (Blog)
function PopularPostsForm({ content, onChange, blogPosts, isLoading }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void; blogPosts: any[]; isLoading: boolean }) {
  const c = content || {};
  const selectedPosts = Array.isArray(c.selectedPosts) ? c.selectedPosts : [];
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const addPost = () => update("selectedPosts", [...selectedPosts, ""]);
  const updatePost = (idx: number, value: string) => {
    const next = selectedPosts.map((id: string, i: number) => (i === idx ? value : id));
    update("selectedPosts", next);
  };
  const removePost = (idx: number) => update("selectedPosts", selectedPosts.filter((_: any, i: number) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showPopular"
          checked={c.show !== false} // Default to true
          onChange={(e) => update("show", e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="showPopular" className="text-sm font-medium text-slate-700">Show "Popular This Month" Section</label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Section Title</label>
        <Input value={c.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Popular This Month" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Mode</label>
        <select
          value={c.mode || "auto"}
          onChange={(e) => update("mode", e.target.value)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="auto">Automatic (Most Viewed)</option>
          <option value="manual">Manual Selection</option>
        </select>
      </div>

      {c.mode === "manual" && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Selected Posts ({selectedPosts.length})</h3>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={addPost}>
              <Plus size={14} /> Add Post
            </Button>
          </div>
          <div className="space-y-2">
            {selectedPosts.map((postId: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                {isLoading ? (
                  <div className="flex-1 h-9 bg-slate-100 animate-pulse rounded-md" />
                ) : (
                  <select
                    value={postId}
                    onChange={(e) => updatePost(idx, e.target.value)}
                    className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a post...</option>
                    {blogPosts.map((post: any) => (
                      <option key={post.id} value={post.id}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                )}
                <Button variant="ghost" size="icon" onClick={() => removePost(idx)} className="h-8 w-8 text-slate-400 hover:text-red-600">
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            {selectedPosts.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 rounded-lg border border-dashed">
                No posts selected. Add one to start manual selection.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 9) PAGE SETTINGS (General)
function PageSettingsForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Posts Per Page</label>
        <Input
          type="number"
          value={c.postsPerPage || 9}
          onChange={(e) => update("postsPerPage", parseInt(e.target.value))}
          min={1}
          max={50}
        />
        <p className="text-xs text-muted-foreground">Number of posts to show before "Load More" button appears.</p>
      </div>
    </div>
  );
}

const SectionForm = ({ type, content, onChange }: SectionFormProps) => {
  const { data: blogPosts = [], isLoading: isBlogLoading } = useGetBlogPostsQuery();

  switch (type) {
    // Home page sections
    case "hero":
      return <HeroForm content={content} onChange={onChange} />;
    case "services":
      return <ServicesForm content={content} onChange={onChange} />;
    case "about":
      return <AboutForm content={content} onChange={onChange} />;
    case "why-choose-us":
      return <WhyChooseUsForm content={content} onChange={onChange} />;
    case "cta":
      return <CTAForm content={content} onChange={onChange} />;
    case "featured-posts":
      return <FeaturedPostsForm content={content} onChange={onChange} blogPosts={blogPosts} isLoading={isBlogLoading} />;
    case "popular-posts":
      return <PopularPostsForm content={content} onChange={onChange} blogPosts={blogPosts} isLoading={isBlogLoading} />;
    case "page-settings":
      return <PageSettingsForm content={content} onChange={onChange} />;

    // About page sections
    case "who_we_are":
      return <WhoWeAreForm content={content} onChange={onChange} />;
    case "stats":
      return <StatsForm content={content} onChange={onChange} />;
    case "values":
      return <ValuesForm content={content} onChange={onChange} />;
    case "team":
      return <TeamForm content={content} onChange={onChange} />;

    default:
      return (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
          <p className="font-semibold">Unsupported section type: "{type}"</p>
          <p className="text-sm mt-1">This type has no form yet.</p>
        </div>
      );
  }
};

export default SectionForm;
