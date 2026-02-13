import { Routes, Route, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/about/page";
import ServicesPage from "../pages/services/page";
import ContactPage from "../pages/contact/page";
import TestimonialsPage from "../pages/testimonials/page";
import SubmitTestimonial from "../pages/testimonials/SubmitTestimonial";
import Layout from "../components/Layout";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminPageEditor from "../pages/admin/PageEditor";
import AdminPagesList from "../pages/admin/PagesList";
import AdminTestimonials from "../pages/admin/AdminTestimonials";
import AdminSettings from "../pages/admin/Settings";
import AdminLogin from "../pages/admin/Login";
import ProtectedRoute from "../components/ProtectedRoute";

const PublicLayout = () => (
    <Layout>
        <Outlet />
    </Layout>
);

export const AppRoutes = () => (
    <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
        </Route>

        {/* Testimonial Submission (standalone, no layout) */}
        <Route path="/submit-testimonial/:token" element={<SubmitTestimonial />} />

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
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="settings" element={<AdminSettings />} />
        </Route>
    </Routes>
);
