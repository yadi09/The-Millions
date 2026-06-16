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
import ModernizationProposal from "../pages/proposal/ModernizationProposal";

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
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/submit-testimonial" element={<SubmitTestimonial />} />
            <Route path="*" element={<ComingSoonPage />} />
        </Route>

        {/* Admin Login Route (Public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Standalone proposal pages (public, no layout chrome — meant to be shared as direct links) */}
        <Route path="/proposal/modernization" element={<ModernizationProposal />} />

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
