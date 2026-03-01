import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Edit, X } from "lucide-react";
import PageEditorContent from "./components/PageEditorContent";
import { useGetPageQuery } from "../../features/api/apiSlice";
import { useNavigate } from "react-router-dom";

// Basic list card type for the grid
interface PageItem {
  name: string;
  slug: string;
  description: string;
  lastEdited: string;
}

const initialPages: PageItem[] = [
  { name: "Home", slug: "home", description: "Landing page and hero section", lastEdited: "—" },
  // { name: "Services", slug: "services", description: "Service offerings and features", lastEdited: "—" },
  { name: "About", slug: "about", description: "Company information and team", lastEdited: "—" },
  // { name: "Contract", slug: "contact", description: "Contact form and support", lastEdited: "—" },
  // { name: "Blog", slug: "blog", description: "Blog posts and articles", lastEdited: "—" },
  // { name: "FAQ", slug: "faq", description: "Frequently asked questions", lastEdited: "—" },
  // { name: "Privacy Policy", slug: "privacy-policy", description: "Privacy policy and legal terms", lastEdited: "—" },
  // { name: "Terms of Service", slug: "terms", description: "Terms of service agreement", lastEdited: "—" },
  { name: "Testimonials", slug: "testimonials", description: "Client success stories and reviews", lastEdited: "—" }
];

const AdminPagesList = () => {
  const navigate = useNavigate();
  // Grid state
  const [pages] = useState<PageItem[]>(initialPages);

  // Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Backend data for Home page (just for status display)
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">All Pages</h1>
        <p className="text-slate-500 mt-2">View and manage all website pages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card key={page.slug} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{page.slug === "home" ? (homePage?.title || page.name) : page.name}</CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate-500">
                  {page.slug === "home"
                    ? homePage
                      ? "Synced with backend"
                      : isHomeLoading
                        ? "Loading…"
                        : "Awaiting data"
                    : "Available on website"}
                </span>
                <Button
                  variant="secondary"
                  className="inline-flex items-center gap-2"
                  onClick={() => {
                    const isMobile = window.innerWidth < 1024;
                    if (isMobile) {
                      navigate(`/admin/pages/${page.slug}`);
                    } else {
                      openEditor(page.slug);
                    }
                  }}
                >
                  <Edit size={16} />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Editor */}
      {isEditOpen && selectedSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Close button absolute top right for backup */}
            <button
              onClick={closeEditor}
              className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm md:hidden"
            >
              <X size={20} />
            </button>

            <PageEditorContent
              slug={selectedSlug}
              onClose={closeEditor}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPagesList;
