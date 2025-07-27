import {Routes, Route } from "react-router-dom";
import Home from "../pages/home";

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
    </Routes>
);
