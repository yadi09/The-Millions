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
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="animate-fade-in">
        <h1 className="font-cormorant text-4xl md:text-5xl font-light text-white mb-4 uppercase tracking-widest">
          Site Architecture
        </h1>
        <div className="flex items-center gap-4 text-millions-accent text-[0.7rem] tracking-[0.3em] uppercase mb-8">
          <div className="w-8 h-[1px] bg-millions-accent" />
          Manage Architectural Refinements
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page, idx) => {
          const Icon = page.icon;
          return (
            <Card
              key={page.slug}
              className="bg-white/5 border-white/10 backdrop-blur-md rounded-none hover:border-millions-accent/40 transition-all duration-500 group animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-millions-accent/50 transition-colors">
                    <Icon className="w-5 h-5 text-millions-accent" />
                  </div>
                  <span className="text-[0.6rem] font-jost text-white/30 uppercase tracking-widest italic font-light">
                    {page.slug === "home" ? (homePage ? "Active Sync" : isHomeLoading ? "Syncing..." : "Offline") : "Architecture"}
                  </span>
                </div>

                <h3 className="font-cormorant text-2xl text-white font-light mb-2">
                  {page.slug === "home" ? (homePage?.title || page.name) : page.name}
                </h3>

                <p className="text-white/40 text-sm font-jost leading-relaxed mb-8 h-10 line-clamp-2">
                  {page.description}
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[0.55rem] uppercase tracking-tighter text-white/20 mb-1">Last Edited</span>
                    <span className="text-[0.65rem] text-white/60 font-jost italic font-light">{page.lastEdited}</span>
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
                    className="bg-transparent border border-millions-accent text-millions-accent hover:bg-millions-accent hover:text-millions-dark rounded-none uppercase text-[0.65rem] tracking-widest px-6 h-10 transition-all duration-300"
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
