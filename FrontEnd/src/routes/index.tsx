import {Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/about/page";

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
    </Routes>
);
