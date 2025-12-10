import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { User, Heart, MessageSquare, Settings, LogOut, MapPin, BedDouble, Bath, Square, X } from 'lucide-react';
import { useLogoutMutation, useUpdateUserMutation, useGetWishlistQuery, useToggleWishlistMutation } from '../store/usersApiSlice';
import { logOut, setCredentials } from '../store/authSlice';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('profile');
    const [logout] = useLogoutMutation();
    const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();
    const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery();
    const [toggleWishlist] = useToggleWishlistMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Local state for profile form to avoid "prefilled" lock-in
    const [name, setName] = useState(user?.name || '');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUser({ name, email: user.email }).unwrap();
            dispatch(setCredentials({
                user: {
                    _id: res._id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    avatar: res.avatar
                },
                token: res.token
            }));
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
                                src={user?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=1e293b&color=fbbf24&size=256&length=1"}
                                alt={user?.name}
                                className="w-24 h-24 rounded-full border-2 border-gold-400 mr-6 object-cover"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=1e293b&color=fbbf24&size=256&length=1";
                                }}
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
                const handleRemoveFromWishlist = async (propertyId) => {
                    try {
                        await toggleWishlist(propertyId).unwrap();
                        refetchWishlist();
                    } catch (err) {
                        console.error(err);
                    }
                };

                return (
                    <div className="bg-navy-800 p-6 rounded-lg border border-navy-700">
                        <h2 className="text-2xl font-serif text-cream mb-6">My Wishlist</h2>
                        {!wishlistData || wishlistData?.length === 0 ? (
                            <div className="text-center py-12">
                                <Heart size={48} className="mx-auto text-gray-600 mb-4" />
                                <p className="text-gray-400">Your wishlist is empty</p>
                                <Link to="/properties" className="text-gold-400 hover:text-gold-500 mt-2 inline-block">
                                    Browse Properties
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlistData?.map((property) => (
                                    <div key={property._id} className="bg-navy-900 rounded-lg overflow-hidden border border-navy-700 hover:border-gold-400 transition-all relative group">
                                        <button
                                            onClick={() => handleRemoveFromWishlist(property._id)}
                                            className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all"
                                            title="Remove from wishlist"
                                        >
                                            <X size={16} />
                                        </button>
                                        <Link to={`/properties/${property.slug}`}>
                                            <img
                                                src={property.coverImage}
                                                alt={property.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <h3 className="text-lg font-bold text-cream mb-2 line-clamp-1">{property.title}</h3>
                                                <p className="text-gold-400 text-xl font-bold mb-3">${property.price.toLocaleString()}</p>
                                                <div className="flex items-center text-gray-400 text-sm gap-4 mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {property.location.city}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-400 text-sm gap-4">
                                                    {property.bedrooms > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <BedDouble size={14} />
                                                            {property.bedrooms}
                                                        </span>
                                                    )}
                                                    {property.bathrooms > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Bath size={14} />
                                                            {property.bathrooms}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Square size={14} />
                                                        {property.areaSqft.toLocaleString()} sqft
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
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
