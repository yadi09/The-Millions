import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import ContactPage from "../pages/contact/page";
import Layout from "../components/Layout";
import BlogPage from "../pages/blog/page";
import BlogPost from "../pages/blog/BlogPost";
import ComingSoonPage from "../pages/comingSoon/page";
import AdminLayout from "../components/AdminLayout";
import AdminLogin from "../pages/admin/Login";
import BlogManagement from "../pages/admin/BlogManagement";
import BlogEditor from "../pages/admin/BlogEditor";
import ProtectedRoute from "../components/ProtectedRoute";
import TestimonialsPage from "../pages/testimonials/page";
import SubmitTestimonial from "../pages/testimonials/submit";
import TestimonialsManagement from "../pages/admin/TestimonialsManagement";
import ServicesManagement from "../pages/admin/ServicesManagement";
import ServiceEditor from "../pages/admin/ServiceEditor";
import Landing from "../pages/Landing";
import InboxManagement from "../pages/admin/InboxManagement";
import AdminSettings from "../pages/admin/Settings";
import BrandAssets from "../pages/admin/BrandAssets";
import BusinessCardBuilder from "../pages/admin/BusinessCardBuilder";
import SocialPostBuilder from "../pages/admin/SocialPostBuilder";
import SiteVisibility from "../pages/admin/SiteVisibility";
import VisibilityGate from "../components/VisibilityGate";

const PublicLayout = () => (
    <Layout>
        <Outlet />
    </Layout>
);

// The default landing inside the admin shell. All deprecated admin routes
// (landing, footer, pages, dashboard, settings) redirect here.
const ADMIN_DEFAULT = "/admin/inbox";
const DeprecatedRedirect = () => <Navigate to={ADMIN_DEFAULT} replace />;

export const AppRoutes = () => (
    <Routes>
        {/* Public Routes — each gated by the page-visibility toggle.
            Individual blog posts (/blog/:slug) are intentionally NOT gated
            via the blog key because they have their own DRAFT / PUBLISHED
            status; gating them here would double-filter. */}
        <Route element={<PublicLayout />}>
            <Route path="/" element={<VisibilityGate pageKey="home"><Landing /></VisibilityGate>} />
            <Route path="/contact" element={<VisibilityGate pageKey="contact"><ContactPage /></VisibilityGate>} />
            <Route path="/blog" element={<VisibilityGate pageKey="blog"><BlogPage /></VisibilityGate>} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/testimonials" element={<VisibilityGate pageKey="testimonials"><TestimonialsPage /></VisibilityGate>} />
            <Route path="/submit-testimonial" element={<VisibilityGate pageKey="submit-testimonial"><SubmitTestimonial /></VisibilityGate>} />
            <Route path="*" element={<ComingSoonPage />} />
        </Route>

        {/* Admin Login Route (Public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
            <ProtectedRoute>
                <AdminLayout>
                    <Outlet />
                </AdminLayout>
            </ProtectedRoute>
        }>
            <Route index element={<Navigate to={ADMIN_DEFAULT} replace />} />

            {/* Live admin tools */}
            <Route path="inbox" element={<InboxManagement />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="blog/new" element={<BlogEditor />} />
            <Route path="blog/edit/:id" element={<BlogEditor />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="services/new" element={<ServiceEditor />} />
            <Route path="services/edit/:id" element={<ServiceEditor />} />
            <Route path="testimonials" element={<TestimonialsManagement />} />
            <Route path="brand" element={<BrandAssets />} />
            <Route path="business-card" element={<BusinessCardBuilder />} />
            <Route path="social-posts" element={<SocialPostBuilder />} />
            <Route path="visibility" element={<SiteVisibility />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* Deprecated — content editing now lives on the live site via
                inline editing (visit /?edit=1 as an admin). These routes
                redirect to the default admin landing so old bookmarks no
                longer render the legacy editors. */}
            <Route path="landing" element={<DeprecatedRedirect />} />
            <Route path="footer" element={<DeprecatedRedirect />} />
            <Route path="pages" element={<DeprecatedRedirect />} />
            <Route path="pages/:slug" element={<DeprecatedRedirect />} />
            <Route path="dashboard" element={<DeprecatedRedirect />} />

            {/* Catch any other /admin/* nonsense too. */}
            <Route path="*" element={<DeprecatedRedirect />} />
        </Route>
    </Routes>
);
