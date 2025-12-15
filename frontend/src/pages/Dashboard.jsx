import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { User, Heart, MessageSquare, Settings, LogOut, MapPin, BedDouble, Bath, Square, X } from 'lucide-react';
import { useLogoutMutation, useUpdateUserMutation, useGetWishlistQuery, useToggleWishlistMutation } from '../store/usersApiSlice';
import { logOut, setCredentials } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || err.error);
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <motion.div
                        className="bg-navy-800 p-6 rounded-lg border border-navy-700"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key="profile"
                    >
                        <motion.h2
                            className="text-2xl font-serif text-cream mb-6"
                            variants={itemVariants}
                        >
                            Profile Settings
                        </motion.h2>
                        <motion.div
                            className="flex items-center mb-8"
                            variants={itemVariants}
                        >
                            <motion.img
                                src={user?.avatar && !user.avatar.includes('ui-avatars.com') ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.name || "User").charAt(0))}&background=1e293b&color=fbbf24&size=256&length=1`}
                                alt={user?.name}
                                className="w-24 h-24 rounded-full border-2 border-gold-400 mr-6 object-cover"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.name || "User").charAt(0))}&background=1e293b&color=fbbf24&size=256&length=1`;
                                }}
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            />
                            <div>
                                <h3 className="text-xl font-bold text-cream">{user?.name}</h3>
                                <p className="text-gray-400">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-gold-400 text-navy-900 text-xs font-bold rounded-full uppercase">
                                    {user?.role}
                                </span>
                            </div>
                        </motion.div>
                        <motion.form
                            onSubmit={handleUpdateProfile}
                            className="space-y-4 max-w-md"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <motion.input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    whileFocus={{ scale: 1.01, borderColor: '#fbbf24' }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="input-field opacity-50 cursor-not-allowed"
                                />
                            </motion.div>
                            <motion.button
                                disabled={isLoading}
                                className="btn-primary w-full"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? 'Updating...' : 'Update Profile'}
                            </motion.button>
                            {isSuccess && (
                                <motion.p
                                    className="text-green-500 text-sm text-center mt-2"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    Profile updated successfully!
                                </motion.p>
                            )}
                        </motion.form>
                    </motion.div>
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
                    <motion.div
                        className="bg-navy-800 p-6 rounded-lg border border-navy-700"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key="wishlist"
                    >
                        <motion.h2
                            className="text-2xl font-serif text-cream mb-6"
                            variants={itemVariants}
                        >
                            My Wishlist
                        </motion.h2>
                        {!wishlistData || wishlistData?.length === 0 ? (
                            <motion.div
                                className="text-center py-12"
                                variants={itemVariants}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Heart size={48} className="mx-auto text-gray-600 mb-4" />
                                </motion.div>
                                <p className="text-gray-400">Your wishlist is empty</p>
                                <Link to="/properties" className="text-gold-400 hover:text-gold-500 mt-2 inline-block">
                                    Browse Properties
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                            >
                                <AnimatePresence>
                                    {wishlistData?.map((property, index) => (
                                        <motion.div
                                            key={property._id}
                                            className="bg-navy-900 rounded-lg overflow-hidden border border-navy-700 hover:border-gold-400 transition-all relative group"
                                            variants={cardVariants}
                                            layout
                                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                                            whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                        >
                                            <motion.button
                                                onClick={() => handleRemoveFromWishlist(property._id)}
                                                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all"
                                                title="Remove from wishlist"
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 + 0.3 }}
                                            >
                                                <X size={16} />
                                            </motion.button>
                                            <Link to={`/properties/${property.slug}`}>
                                                <motion.img
                                                    src={property.coverImage}
                                                    alt={property.title}
                                                    className="w-full h-48 object-cover"
                                                    initial={{ scale: 1.1 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    whileHover={{ scale: 1.05 }}
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
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </motion.div>
                );
            case 'inquiries':
                return (
                    <motion.div
                        className="bg-navy-800 p-6 rounded-lg border border-navy-700"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key="inquiries"
                    >
                        <motion.h2
                            className="text-2xl font-serif text-cream mb-4"
                            variants={itemVariants}
                        >
                            My Inquiries
                        </motion.h2>
                        <motion.p
                            className="text-gray-400"
                            variants={itemVariants}
                        >
                            Track your conversations with agents here.
                        </motion.p>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <motion.h1
                    className="text-3xl font-serif text-cream mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    Dashboard
                </motion.h1>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <motion.div
                        className="w-full md:w-64 flex-shrink-0"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="bg-navy-800 rounded-lg p-4 border border-navy-700">
                            <nav className="space-y-2">
                                <motion.button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'profile' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <User size={20} /> Profile
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab('wishlist')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'wishlist' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Heart size={20} /> Wishlist
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab('inquiries')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'inquiries' ? 'bg-gold-400 text-navy-900 font-bold' : 'text-gray-400 hover:bg-navy-700 hover:text-white'}`}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MessageSquare size={20} /> Inquiries
                                </motion.button>
                                {user?.role === 'admin' && (
                                    <motion.button
                                        onClick={() => toast.info('Admin Dashboard coming soon!')}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded text-red-400 hover:bg-navy-700 hover:text-red-300"
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Settings size={20} /> Admin Panel
                                    </motion.button>
                                )}
                                <div className="border-t border-navy-700 my-2 pt-2"></div>
                                <motion.button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-gray-400 hover:bg-navy-700 hover:text-white transition-colors"
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <LogOut size={20} /> Logout
                                </motion.button>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        className="flex-grow"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <AnimatePresence mode="wait">
                            {renderContent()}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
