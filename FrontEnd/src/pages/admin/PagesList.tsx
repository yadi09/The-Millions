import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MessageSquare, Mail, BookOpen, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageItem {
  name: string;
  slug: string;
  description: string;
  lastEdited: string;
  icon: any;
}

const initialPages: PageItem[] = [
  { name: "Testimonials", slug: "testimonials", description: "Success stories and client feedback identity", lastEdited: "Ready to Sync", icon: MessageSquare },
  { name: "Contact Page", slug: "contact", description: "Inquiry gateways and engagement architecture", lastEdited: "Ready to Sync", icon: Mail },
  { name: "Editorial Blog", slug: "blog", description: "Insights, tips and knowledge platform identity", lastEdited: "Ready to Sync", icon: BookOpen }
];

const AdminPagesList = () => {
    const navigate = useNavigate();
    const [pages] = useState<PageItem[]>(initialPages);

    return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      <div className="animate-fade-in">
        <h1 className="font-cormorant text-[clamp(2.2rem,5vw,3.5rem)] font-light text-white mb-4 leading-tight">
          Site <em className="italic text-millions-accent not-italic">Architecture</em>
        </h1>
        <div className="flex items-center gap-4 text-millions-accent text-[0.7rem] tracking-[0.2em] uppercase mb-8">
          <div className="w-8 h-[1px] bg-millions-accent/40" />
          Manage Architectural Refinements
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page, idx) => {
          const Icon = page.icon;
          return (
            <Card
              key={page.slug}
              className="bg-white/5 border-white/5 backdrop-blur-md rounded-none hover:border-millions-accent/30 transition-all duration-500 group animate-fade-in-up shadow-sm hover:shadow-xl"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-11 h-11 bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-millions-accent/30 transition-colors">
                    <Icon className="w-4 h-4 text-millions-accent" />
                  </div>
                  <span className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.15em] italic font-light">
                    {page.slug === "home" ? "Active Sync" : "Architecture"}
                  </span>
                </div>

                <h3 className="font-cormorant text-[1.6rem] text-white font-light mb-2 italic">
                  {page.name}
                </h3>

                <p className="text-white/40 text-[0.85rem] font-jost leading-relaxed mb-8 h-10 line-clamp-2 font-light">
                  {page.description}
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[0.55rem] uppercase tracking-wider text-white/20 mb-1">Last Edited</span>
                    <span className="text-[0.65rem] text-white/50 font-jost italic font-light tracking-wide">{page.lastEdited}</span>
                  </div>
                  <Button
                    onClick={() => navigate(`/admin/pages/${page.slug}`)}
                    className="bg-transparent border border-millions-accent/40 text-millions-accent hover:bg-millions-accent hover:text-millions-dark rounded-none uppercase text-[0.65rem] tracking-[0.2em] px-6 h-10 transition-all duration-300 font-bold"
                  >
                    Refine
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPagesList;
