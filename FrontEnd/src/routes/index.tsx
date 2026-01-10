import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/about/page";
import ContactPage from "../pages/contact/page"
import ServicesPage from "../pages/services/page"

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
    </Routes>
);
