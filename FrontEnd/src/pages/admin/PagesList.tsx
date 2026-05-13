import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MessageSquare, Mail, BookOpen, Monitor, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ICON_MAP: Record<string, any> = {
  testimonials: MessageSquare,
  contact: Mail,
  blog: BookOpen,
  home: Monitor,
  default: FileText
};

const managedPages = [
    { 
        name: "Testimonials", 
        slug: "testimonials", 
        description: "Success stories and client feedback architectural management.",
        status: "Architecture"
    },
    { 
        name: "Contact Gateway", 
        slug: "contact", 
        description: "Inquiry interfaces and engagement structural components.",
        status: "Architecture"
    },
    { 
        name: "Insights & Blog", 
        slug: "blog", 
        description: "Editorial platform and knowledge sharing architecture.",
        status: "Architecture"
    }
];

const AdminPagesList = () => {
    const navigate = useNavigate();

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
        {managedPages.map((page, idx) => {
          const Icon = ICON_MAP[page.slug] || ICON_MAP.default;
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
                    {page.status}
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
                    <span className="text-[0.55rem] uppercase tracking-wider text-white/20 mb-1">Architecture Identity</span>
                    <span className="text-[0.65rem] text-white/50 font-jost italic font-light tracking-wide">{page.slug.toUpperCase()}</span>
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
