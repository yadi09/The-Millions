import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { X, MessageSquare } from "lucide-react";
import PageEditorContent from "./components/PageEditorContent";
import { useGetPageQuery } from "../../features/api/apiSlice";
import { useNavigate } from "react-router-dom";

interface PageItem {
  name: string;
  slug: string;
  description: string;
  lastEdited: string;
  icon: any;
}

const initialPages: PageItem[] = [
  { name: "Testimonials", slug: "testimonials", description: "Client success and impact proof", lastEdited: "Ready for Sync", icon: MessageSquare }
];

const AdminPagesList = () => {
  const navigate = useNavigate();
  const [pages] = useState<PageItem[]>(initialPages);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: homePage, isLoading: isHomeLoading } = useGetPageQuery("home");

  const openEditor = (slug: string) => {
    setSelectedSlug(slug);
    setIsEditOpen(true);
  };

  const closeEditor = () => {
    setIsEditOpen(false);
    setSelectedSlug(null);
  };

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
                    {page.slug === "home" ? (homePage ? "Active Sync" : isHomeLoading ? "Syncing..." : "Offline") : "Architecture"}
                  </span>
                </div>

                <h3 className="font-cormorant text-[1.6rem] text-white font-light mb-2 italic">
                  {page.slug === "home" ? (homePage?.title || page.name) : page.name}
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
                    onClick={() => {
                      const isMobile = window.innerWidth < 1024;
                      if (isMobile) {
                        navigate(`/admin/pages/${page.slug}`);
                      } else {
                        openEditor(page.slug);
                      }
                    }}
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

      {/* Modal Editor Overlay */}
      {isEditOpen && selectedSlug && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-millions-dark/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-7xl h-[92vh] bg-millions-dark border border-white/10 shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
            <button
              onClick={closeEditor}
              className="absolute top-6 right-6 z-[110] p-3 text-white/40 hover:text-white hover:rotate-90 transition-all duration-300"
            >
              <X size={24} />
            </button>

            <div className="flex-1 overflow-hidden p-8 md:p-12">
              <PageEditorContent
                slug={selectedSlug}
                onClose={closeEditor}
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPagesList;
