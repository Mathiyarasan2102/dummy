import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { User, Heart, MessageSquare, Settings, LogOut } from 'lucide-react';
import { useLogoutMutation, useUpdateUserMutation } from '../store/usersApiSlice';
import { logOut, setCredentials } from '../store/authSlice';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('profile');
    const [logout] = useLogoutMutation();
    const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Local state for profile form to avoid "prefilled" lock-in
    const [name, setName] = useState(user?.name || '');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUser({ name, email: user.email }).unwrap();
            dispatch(setCredentials({ ...res }));
            // Optional: Show success toast
        } catch (err) {
            console.error(err);
            alert(err?.data?.message || err.error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(logOut());
            navigate('/login');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-navy-800 p-6 rounded-lg border border-navy-700">
                        <h2 className="text-2xl font-serif text-cream mb-6">Profile Settings</h2>
                        <div className="flex items-center mb-8">
                            <img
                                src={user?.avatar}
                                alt={user?.name}
                                className="w-24 h-24 rounded-full border-2 border-gold-400 mr-6"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-cream">{user?.name}</h3>
                                <p className="text-gray-400">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-gold-400 text-navy-900 text-xs font-bold rounded-full uppercase">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="input-field opacity-50 cursor-not-allowed"
                                />
                            </div>
                            <button disabled={isLoading} className="btn-primary w-full">
                                {isLoading ? 'Updating...' : 'Update Profile'}
                            </button>
                            {isSuccess && <p className="text-green-500 text-sm text-center mt-2">Profile updated successfully!</p>}
                        </form>
                    </div>
                );
            case 'wishlist':
                return (
                    <div className="bg-navy-800 p-6 rounded-lg border border-navy-700">
                        <h2 className="text-2xl font-serif text-cream mb-4">My Wishlist</h2>
                        <p className="text-gray-400">Your saved properties will appear here.</p>
                    </div>
                );
            case 'inquiries':
                return (
                    <div className="bg-navy-800 p-6 rounded-lg border border-navy-700">
                        <h2 className="text-2xl font-serif text-cream mb-4">My Inquiries</h2>
                        <p className="text-gray-400">Track your conversations with agents here.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-serif text-cream mb-8">Dashboard</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-navy-800 rounded-lg p-4 border border-navy-700">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'profile' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                >
                                    <User size={20} /> Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('wishlist')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'wishlist' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                >
                                    <Heart size={20} /> Wishlist
                                </button>
                                <button
                                    onClick={() => setActiveTab('inquiries')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'inquiries' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                >
                                    <MessageSquare size={20} /> Inquiries
                                </button>
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => alert('Navigate to Admin Dashboard')}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded text-red-400 hover:bg-navy-700 hover:text-red-300"
                                    >
                                        <Settings size={20} /> Admin Panel
                                    </button>
                                )}
                                <div className="border-t border-navy-700 my-2 pt-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-gray-400 hover:bg-navy-700 hover:text-white transition-colors"
                                >
                                    <LogOut size={20} /> Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
