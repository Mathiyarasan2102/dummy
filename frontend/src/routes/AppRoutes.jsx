import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import AuthPage from '../pages/AuthPage';
import Properties from '../pages/Properties';
import PropertyDetail from '../pages/PropertyDetail';
import Dashboard from '../pages/Dashboard';
import SellerDashboard from '../pages/SellerDashboard';
import AddProperty from '../pages/AddProperty';
import EditProperty from '../pages/EditProperty';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Routes with Flip Animation Persistence */}
            <Route element={<AuthPage />}>
                <Route path="/login" element={<></>} />
                <Route path="/register" element={<></>} />
            </Route>

            {/* Property Routes */}
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:slug" element={<PropertyDetail />} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/add-property" element={<AddProperty />} />
            <Route path="/seller/edit-property/:id" element={<EditProperty />} />
        </Routes>
    );
};

export default AppRoutes;
