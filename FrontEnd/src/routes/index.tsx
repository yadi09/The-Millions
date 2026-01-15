import { Routes, Route, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/about/page";
import ServicesPage from "../pages/services/page";
import ContactPage from "../pages/contact/page";
import Layout from "../components/Layout";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminPageEditor from "../pages/admin/PageEditor";
import AdminPagesList from "../pages/admin/PagesList";
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
            <Route path="settings" element={<AdminSettings />} />
        </Route>
    </Routes>
);
