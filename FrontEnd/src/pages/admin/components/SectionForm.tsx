import { Input } from "../../../components/ui/input";
import { Loader2, Eye, Image, BarChart2, PhoneCall, TrendingUp } from "lucide-react";
import { useGetBlogPostsQuery } from "../../../features/api/apiSlice";

type SectionFormProps = {
  type: string;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

// ─── Shared UI Primitives ───────────────────────────────────────────────────

const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">{children}</label>
);

const FormSectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-white/5">
    <Icon className="w-3.5 h-3.5 text-millions-accent shrink-0" />
    <h3 className="text-[0.65rem] sm:text-[0.7rem] font-jost text-white font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] break-words">{title}</h3>
  </div>
);

const FieldGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <FormLabel>{label}</FormLabel>
    {children}
  </div>
);

const DarkInput = (props: any) => (
  <Input
    {...props}
    className={`bg-white/5 border-white/10 text-white font-jost text-xs tracking-widest focus-visible:ring-0 focus-visible:border-millions-accent/40 rounded-none h-11 transition-all placeholder:text-white/10 ${props.className || ""}`}
  />
);

const DarkTextarea = (props: any) => (
  <textarea
    {...props}
    className={`w-full bg-white/5 border border-white/10 text-white font-jost text-xs tracking-widest focus:outline-none focus:border-millions-accent/40 rounded-none p-3 transition-all placeholder:text-white/10 min-h-[88px] resize-y ${props.className || ""}`}
  />
);

// ─── Form Components ────────────────────────────────────────────────────────

// 1) HERO FORM
function HeroForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const updateCta = (idx: number, key: string, val: string) => {
    const ctas = [...(c.ctas || [])];
    ctas[idx] = typeof ctas[idx] === "object" ? { ...ctas[idx], [key]: val } : val;
    update("ctas", ctas);
  };

  const updateFeature = (idx: number, val: string) => {
    const features = [...(c.features || [])];
    features[idx] = val;
    update("features", features);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <FormSectionHeader title="Hero Section" icon={Image} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup label="Badge / Label">
          <DarkInput value={c.badge || ""} onChange={(e: any) => update("badge", e.target.value)} placeholder="e.g. Success Stories" />
        </FieldGroup>
        <FieldGroup label="Background Image URL">
          <DarkInput value={c.backgroundImageUrl || ""} onChange={(e: any) => update("backgroundImageUrl", e.target.value)} placeholder="https://..." />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup label="Primary Headline (Dark)">
          <DarkInput value={c.headlineBlack || ""} onChange={(e: any) => update("headlineBlack", e.target.value)} placeholder="e.g. Client" />
        </FieldGroup>
        <FieldGroup label="Emphasized Headline (Gold)">
          <DarkInput value={c.headlineBlue || ""} onChange={(e: any) => update("headlineBlue", e.target.value)} placeholder="e.g. Success Stories." />
        </FieldGroup>
      </div>

      <FieldGroup label="Description / Sub-text">
        <DarkTextarea value={c.description || ""} onChange={(e: any) => update("description", e.target.value)} placeholder="Supporting narrative..." />
      </FieldGroup>

      {/* CTAs */}
      <div className="space-y-4">
        <FormLabel>Call-to-Action Buttons</FormLabel>
        {(c.ctas || []).map((cta: any, i: number) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/[0.02] border border-white/5">
            <div className="space-y-1">
              <FormLabel>CTA {i + 1} — Label</FormLabel>
              <DarkInput value={typeof cta === "object" ? cta.label : cta} onChange={(e: any) => updateCta(i, "label", e.target.value)} placeholder="Button label" />
            </div>
            <div className="space-y-1">
              <FormLabel>CTA {i + 1} — Action / URL</FormLabel>
              <DarkInput value={typeof cta === "object" ? cta.action : ""} onChange={(e: any) => updateCta(i, "action", e.target.value)} placeholder="/contact or book_consultation" />
            </div>
          </div>
        ))}
      </div>

      {/* Feature Tags */}
      {(c.features || []).length > 0 && (
        <div className="space-y-4">
          <FormLabel>Feature Tags</FormLabel>
          {(c.features || []).map((feat: string, i: number) => (
            <DarkInput key={i} value={feat} onChange={(e: any) => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// 2) STATS FORM
function StatsForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const updateStat = (idx: number, key: string, val: string) => {
    const stats = [...(c.stats || [])];
    stats[idx] = { ...stats[idx], [key]: val };
    update("stats", stats);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <FormSectionHeader title="Stats Section" icon={BarChart2} />

      <FieldGroup label="Section Title">
        <DarkInput value={c.title || ""} onChange={(e: any) => update("title", e.target.value)} placeholder="e.g. Why Clients Trust Us" />
      </FieldGroup>

      <FieldGroup label="Description">
        <DarkTextarea value={c.description || ""} onChange={(e: any) => update("description", e.target.value)} placeholder="Supporting description..." />
      </FieldGroup>

      <div className="space-y-4">
        <FormLabel>Statistics</FormLabel>
        {(c.stats || []).map((stat: any, i: number) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/[0.02] border border-white/5">
            <div className="space-y-1">
              <FormLabel>Value</FormLabel>
              <DarkInput value={stat.value || ""} onChange={(e: any) => updateStat(i, "value", e.target.value)} placeholder="e.g. 98%" />
            </div>
            <div className="space-y-1">
              <FormLabel>Label</FormLabel>
              <DarkInput value={stat.label || ""} onChange={(e: any) => updateStat(i, "label", e.target.value)} placeholder="e.g. Client Satisfaction" />
            </div>
            <div className="space-y-1">
              <FormLabel>Icon URL</FormLabel>
              <DarkInput value={stat.iconUrl || ""} onChange={(e: any) => updateStat(i, "iconUrl", e.target.value)} placeholder="https://..." />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3) CTA FORM
function CtaForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  const updateAction = (idx: number, key: string, val: string) => {
    const actions = [...(c.actions || [])];
    actions[idx] = { ...actions[idx], [key]: val };
    update("actions", actions);
  };

  const updateContact = (key: string, val: string) => {
    update("contact", { ...(c.contact || {}), [key]: val });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <FormSectionHeader title="Call to Action Section" icon={PhoneCall} />

      <FieldGroup label="Headline">
        <DarkInput value={c.title || ""} onChange={(e: any) => update("title", e.target.value)} placeholder="e.g. Ready to define your own success story?" />
      </FieldGroup>

      <FieldGroup label="Description">
        <DarkTextarea value={c.description || ""} onChange={(e: any) => update("description", e.target.value)} placeholder="Supporting copy..." />
      </FieldGroup>

      {/* Actions */}
      {(c.actions || []).length > 0 && (
        <div className="space-y-4">
          <FormLabel>Action Buttons</FormLabel>
          {(c.actions || []).map((action: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/[0.02] border border-white/5">
              <div className="space-y-1">
                <FormLabel>Button {i + 1} — Label</FormLabel>
                <DarkInput value={action.label || ""} onChange={(e: any) => updateAction(i, "label", e.target.value)} placeholder="Button label" />
              </div>
              <div className="space-y-1">
                <FormLabel>Button {i + 1} — Action / URL</FormLabel>
                <DarkInput value={action.action || ""} onChange={(e: any) => updateAction(i, "action", e.target.value)} placeholder="/contact or book_consultation" />
              </div>
              {action.description !== undefined && (
                <div className="md:col-span-2 space-y-1">
                  <FormLabel>Button {i + 1} — Tooltip Description</FormLabel>
                  <DarkInput value={action.description || ""} onChange={(e: any) => updateAction(i, "description", e.target.value)} placeholder="Short descriptor" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Info (optional) */}
      {c.contact !== undefined && (
        <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5">
          <FormLabel>Contact Details</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <FormLabel>Phone</FormLabel>
              <DarkInput value={c.contact?.phone || ""} onChange={(e: any) => updateContact("phone", e.target.value)} placeholder="+44 20 1234 5678" />
            </div>
            <div className="space-y-1">
              <FormLabel>Email</FormLabel>
              <DarkInput value={c.contact?.email || ""} onChange={(e: any) => updateContact("email", e.target.value)} placeholder="hello@themillions.co.uk" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 4) POPULAR POSTS FORM
function PopularPostsForm({ content, onChange }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  return (
    <div className="space-y-6 sm:space-y-8">
      <FormSectionHeader title="Popular Posts Section" icon={TrendingUp} />

      <FieldGroup label="Section Title">
        <DarkInput value={c.title || ""} onChange={(e: any) => update("title", e.target.value)} placeholder="e.g. Popular This Month" />
      </FieldGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <FormLabel>Display Mode</FormLabel>
          <select
            value={c.mode || "auto"}
            onChange={(e) => update("mode", e.target.value)}
            className="flex h-11 w-full items-center bg-white/5 border border-white/10 px-4 py-2 text-xs font-jost text-white uppercase tracking-widest focus:outline-none focus:border-millions-accent/40 rounded-none cursor-pointer"
          >
            <option value="auto" className="bg-millions-dark">Auto (by views)</option>
            <option value="manual" className="bg-millions-dark">Manual selection</option>
          </select>
        </div>

        <div className="space-y-2">
          <FormLabel>Visibility</FormLabel>
          <select
            value={c.show ? "true" : "false"}
            onChange={(e) => update("show", e.target.value === "true")}
            className="flex h-11 w-full items-center bg-white/5 border border-white/10 px-4 py-2 text-xs font-jost text-white uppercase tracking-widest focus:outline-none focus:border-millions-accent/40 rounded-none cursor-pointer"
          >
            <option value="true" className="bg-millions-dark">Visible</option>
            <option value="false" className="bg-millions-dark">Hidden</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// 5) FEATURED POSTS FORM (existing)
function FeaturedPostsForm({ content, onChange, blogPosts, isLoading }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void; blogPosts: any[]; isLoading: boolean }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  return (
    <div className="space-y-6 sm:space-y-8">
      <FormSectionHeader title="Highlighted Editorial" icon={Eye} />
      <div className="space-y-2">
        <FormLabel>Display Filter (Title)</FormLabel>
        <DarkInput value={c.title || ""} onChange={(e: any) => update("title", e.target.value)} placeholder="EX: EDITOR'S PERSPECTIVE" />
      </div>
      <div className="space-y-4">
        <FormLabel>Target Architectural Note</FormLabel>
        {isLoading ? (
          <div className="flex items-center gap-3 text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.3em] font-medium p-4 bg-white/5 border border-white/10">
            <Loader2 className="w-4 h-4 animate-spin text-millions-accent" />
            Intercepting Data...
          </div>
        ) : (
          <select
            value={c.featuredPostId || ""}
            onChange={(e) => update("featuredPostId", e.target.value)}
            className="flex h-11 w-full items-center justify-between bg-white/5 border border-white/10 px-4 py-2 text-xs font-jost text-white uppercase tracking-widest focus:outline-none focus:border-millions-accent/40 rounded-none cursor-pointer"
          >
            <option value="" className="bg-millions-dark">--- SELECT CORE PERSPECTIVE ---</option>
            {blogPosts.map((post: any) => (
              <option key={post.id} value={post.id} className="bg-millions-dark">
                {post.title.toUpperCase()} ({post.status})
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

// ─── Router ─────────────────────────────────────────────────────────────────

const SectionForm = ({ type, content, onChange }: SectionFormProps) => {
  const { data: blogPosts = [], isLoading: isBlogLoading } = useGetBlogPostsQuery();

  switch (type) {
    case "hero":
      return <HeroForm content={content} onChange={onChange} />;
    case "stats":
      return <StatsForm content={content} onChange={onChange} />;
    case "cta":
      return <CtaForm content={content} onChange={onChange} />;
    case "popular-posts":
      return <PopularPostsForm content={content} onChange={onChange} />;
    case "featured-posts":
      return <FeaturedPostsForm content={content} onChange={onChange} blogPosts={blogPosts} isLoading={isBlogLoading} />;
    default:
      return (
        <div className="p-6 sm:p-8 md:p-12 border border-white/5 border-dashed bg-white/[0.02] flex flex-col items-center justify-center text-center">
          <h3 className="font-cormorant text-lg sm:text-xl md:text-2xl text-white/20 italic mb-2 break-words">Structural Variant Observed: "{type}"</h3>
          <p className="text-[0.55rem] sm:text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.2em] sm:tracking-[0.3em]">No dedicated refinement mapping available.</p>
        </div>
      );
  }
};

export default SectionForm;
