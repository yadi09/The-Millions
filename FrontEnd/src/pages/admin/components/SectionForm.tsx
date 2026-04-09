import { Input } from "../../../components/ui/input";

import { Loader2, Eye } from "lucide-react";
import { useGetBlogPostsQuery } from "../../../features/api/apiSlice";

type SectionFormProps = {
  type: string;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

// UI Components for the dark editor
const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.2em] mb-2 block ml-1">{children}</label>
);

const FormSectionHeader = ({ title, icon: Icon, action }: { title: string, icon: any, action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
    <div className="flex items-center gap-3">
      <Icon className="w-3.5 h-3.5 text-millions-accent" />
      <h3 className="text-[0.7rem] font-jost text-white font-bold uppercase tracking-[0.3em]">{title}</h3>
    </div>
    {action}
  </div>
);

const DarkInput = (props: any) => (
  <Input
    {...props}
    className={`bg-white/5 border-white/10 text-white font-jost text-xs tracking-widest focus-visible:ring-0 focus-visible:border-millions-accent/40 rounded-none h-11 transition-all placeholder:text-white/10 ${props.className || ''}`}
  />
);



// 7) FEATURED POSTS (Blog)
function FeaturedPostsForm({ content, onChange, blogPosts, isLoading }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void; blogPosts: any[]; isLoading: boolean }) {
  const c = content || {};
  const update = (key: string, value: any) => onChange({ ...c, [key]: value });

  return (
    <div className="space-y-8">
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

// Generic/Base Form Selector
const SectionForm = ({ type, content, onChange }: SectionFormProps) => {
  const { data: blogPosts = [], isLoading: isBlogLoading } = useGetBlogPostsQuery();

  switch (type) {
    case "featured-posts": return <FeaturedPostsForm content={content} onChange={onChange} blogPosts={blogPosts} isLoading={isBlogLoading} />;
    default:
      return (
        <div className="p-12 border border-white/5 border-dashed bg-white/[0.02] flex flex-col items-center justify-center text-center">
          <h3 className="font-cormorant text-2xl text-white/20 italic mb-2">Structural Variant Observed: "{type}"</h3>
          <p className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.3em]">No dedicated refinement mapping available.</p>
        </div>
      );
  }
};

export default SectionForm;
