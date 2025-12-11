import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Dashboard from './pages/Dashboard';
import SellerDashboard from './pages/SellerDashboard';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const App = () => {
    return (
        <>
            <ScrollToTop />
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Auth Routes with Flip Animation Persistance */}
                <Route element={<AuthPage />}>
                    <Route path="/login" element={<></>} />
                    <Route path="/register" element={<></>} />
                </Route>

                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:slug" element={<PropertyDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Seller Routes */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/add-property" element={<AddProperty />} />
                <Route path="/seller/edit-property/:id" element={<EditProperty />} />
            </Routes>
        </>
    );
};

export default App;
