import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Dashboard from './pages/Dashboard';

// Placeholder components until created
// const Dashboard = () => <div>Dashboard</div>;
const PropertiesPlaceholder = () => <div>Properties List</div>;

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:slug" element={<PropertyDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
};

export default App;
