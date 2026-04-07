import { Routes, Route, Outlet } from "react-router-dom";
import ContactPage from "../pages/contact/page";
import Layout from "../components/Layout";
import BlogPage from "../pages/blog/page";
import BlogPost from "../pages/blog/BlogPost";
import ComingSoonPage from "../pages/comingSoon/page";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminPageEditor from "../pages/admin/PageEditor";
import AdminPagesList from "../pages/admin/PagesList";
import AdminSettings from "../pages/admin/Settings";
import AdminLogin from "../pages/admin/Login";
import BlogManagement from "../pages/admin/BlogManagement";
import BlogEditor from "../pages/admin/BlogEditor";
import ProtectedRoute from "../components/ProtectedRoute";
import TestimonialsPage from "../pages/testimonials/page";
import SubmitTestimonial from "../pages/testimonials/submit";
// Admin Testimonials
import TestimonialsManagement from "../pages/admin/TestimonialsManagement";
import ServicesManagement from "../pages/admin/ServicesManagement";
import Landing from "../pages/Landing";

const PublicLayout = () => (
    <Layout>
        <Outlet />
    </Layout>
);

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

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
            <ProtectedRoute>
                <AdminLayout>
                    <Outlet />
                </AdminLayout>
            </ProtectedRoute>
        }>
            <Route index element={<AdminDashboard />} />
            <Route path="pages" element={<AdminPagesList />} />
            <Route path="pages/:slug" element={<AdminPageEditor />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="blog/new" element={<BlogEditor />} />
            <Route path="blog/edit/:id" element={<BlogEditor />} />
            <Route path="testimonials" element={<TestimonialsManagement />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="settings" element={<AdminSettings />} />
        </Route>
    </Routes>
);
