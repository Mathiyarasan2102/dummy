import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetPropertyQuery } from '../store/propertiesApiSlice';
import { useGetWishlistQuery, useToggleWishlistMutation } from '../store/usersApiSlice';
import Layout from '../components/layout/Layout';
import { MapPin, BedDouble, Bath, Square, ArrowLeft, Send, Heart, School, ShoppingBag, Coffee, Train, Trees, Building2, Phone, Mail, Star, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const { data: property, isLoading, error } = useGetPropertyQuery(slug);

    // Wishlist Logic
    const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery(undefined, { skip: !user });
    const [toggleWishlist, { isLoading: isTogglingWishlist }] = useToggleWishlistMutation();

    // Check if current property is in wishlist
    const isInWishlist = wishlistData?.some(item => {
        const itemId = item._id || item;
        const propertyId = property?._id;
        return itemId?.toString() === propertyId?.toString();
    }) || false;

    const handleWishlistToggle = async () => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!property?._id) {
            console.error('Property ID not available');
            return;
        }

        try {
            console.log('Toggling wishlist for property:', property._id);
            const result = await toggleWishlist(property._id).unwrap();
            console.log('Wishlist toggle result:', result);
            await refetchWishlist();
            toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
        } catch (err) {
            console.error('Wishlist toggle error:', err);
            toast.error(err?.data?.message || 'Failed to update wishlist');
        }
    };

    // Inquiry Form State
    const [message, setMessage] = useState('');

    // Image Gallery State
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleInquiry = (e) => {
        e.preventDefault();
        toast.info('Inquiry feature coming soon! Connect with our agents directly.');
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === property.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? property.images.length - 1 : prev - 1
        );
    };

    if (isLoading) return <Layout><div className="text-center py-20 text-gold-400">Loading...</div></Layout>;
    if (error || !property) return <Layout><div className="text-center py-20 text-red-500">Property not found</div></Layout>;

    return (
        <Layout>
            {/* Hero Image */}
            <div className="relative h-[50vh] bg-navy-800">
                <img
                    src={property.coverImage || property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
                    <Link to="/properties" className="text-cream/80 hover:text-gold-400 flex items-center gap-2 mb-4">
                        <ArrowLeft size={20} /> Back to Listings
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-end">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-cream font-bold mb-2">{property.title}</h1>
                            <div className="flex items-center text-xl text-gold-400">
                                <MapPin size={24} className="mr-2" />
                                {property.location?.city}, {property.location?.country}
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <div className="text-3xl md:text-4xl font-bold text-gold-400">
                                ${property.price.toLocaleString()}
                            </div>
                            <button
                                onClick={() => {
                                    setShowGallery(true);
                                    setCurrentImageIndex(0);
                                }}
                                className="px-4 py-2 bg-navy-700 text-cream rounded-lg hover:bg-navy-600 transition-colors"
                            >
                                View Images ({property.images?.length || 1})
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                disabled={isTogglingWishlist}
                                className={`p-3 rounded-full transition-colors ${isInWishlist ? 'bg-red-500 text-white' : 'bg-navy-700 text-gray-300 hover:text-red-500 hover:bg-navy-600'}`}
                                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                <Heart size={28} fill={isInWishlist ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats - Enhanced with Animations */}
                        <motion.div
                            className="grid grid-cols-3 gap-4 bg-navy-800 p-6 rounded-lg border border-navy-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <motion.div
                                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-navy-700 transition-colors"
                                whileHover={{ y: -5, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <BedDouble size={32} className="text-gold-400 mb-2" />
                                </motion.div>
                                <motion.span
                                    className="text-cream text-lg font-bold"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    {property.bedrooms} Bedrooms
                                </motion.span>
                            </motion.div>
                            <motion.div
                                className="flex flex-col items-center justify-center p-4 border-l border-navy-700 rounded-lg hover:bg-navy-700 transition-colors"
                                whileHover={{ y: -5, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <Bath size={32} className="text-gold-400 mb-2" />
                                </motion.div>
                                <motion.span
                                    className="text-cream text-lg font-bold"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    {property.bathrooms} Bathrooms
                                </motion.span>
                            </motion.div>
                            <motion.div
                                className="flex flex-col items-center justify-center p-4 border-l border-navy-700 rounded-lg hover:bg-navy-700 transition-colors"
                                whileHover={{ y: -5, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <Square size={32} className="text-gold-400 mb-2" />
                                </motion.div>
                                <motion.span
                                    className="text-cream text-lg font-bold"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    {property.areaSqft.toLocaleString()} sqft
                                </motion.span>
                            </motion.div>
                        </motion.div>

                        {/* Description */}
                        <div className="bg-navy-800 p-8 rounded-lg border border-navy-700">
                            <h2 className="text-2xl font-serif text-cream mb-4">Description</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenities - Enhanced with Animations */}
                        <motion.div
                            className="bg-navy-800 p-8 rounded-lg border border-navy-700"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <motion.h2
                                className="text-2xl font-serif text-cream mb-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Amenities
                            </motion.h2>
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {property.amenities?.map((amenity, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center text-gray-300 p-3 rounded-lg hover:bg-navy-700 transition-colors"
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.div
                                            className="w-2 h-2 bg-gold-400 rounded-full mr-3"
                                            whileHover={{ scale: 1.5 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                        {amenity}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>


                    </div>

                    {/* Sidebar / Premium Agent Card */}
                    <div className="space-y-8">
                        <motion.div
                            className="bg-navy-800 p-6 rounded-lg border border-navy-700 sticky top-24"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <motion.h3
                                className="text-xl font-serif text-cream mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                Contact Agent
                            </motion.h3>

                            {/* Agent Profile */}
                            <motion.div
                                className="flex items-center mb-6 pb-6 border-b border-navy-700"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <motion.img
                                    src={property.agentId?.avatar && !property.agentId.avatar.includes('ui-avatars.com') ? property.agentId.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent((property.agentId?.name || "Agent").charAt(0))}&background=1e293b&color=fbbf24&size=128&length=1`}
                                    alt="Agent"
                                    className="w-20 h-20 rounded-full border-3 border-gold-400 mr-4 object-cover"
                                    loading="lazy"
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    transition={{ duration: 0.3 }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((property.agentId?.name || "Agent").charAt(0))}&background=1e293b&color=fbbf24&size=128&length=1`;
                                    }}
                                />
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-cream mb-1">{property.agentId?.name || "LuxeEstate Agent"}</h4>
                                    <p className="text-gold-400 text-sm mb-2">Senior Real Estate Agent</p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="text-gold-400 fill-gold-400" />
                                        ))}
                                        <span className="text-xs text-gray-400 ml-1">4.9 (120)</span>
                                    </div>
                                </div>
                            </motion.div>


                            {/* Enhanced Inquiry Form */}
                            <motion.form
                                onSubmit={handleInquiry}
                                className="space-y-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <h4 className="text-sm font-semibold text-gray-400 mb-4">Send Message</h4>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                                    <textarea
                                        rows="4"
                                        className="input-field"
                                        placeholder="I am interested in this property..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    className="w-full btn-primary flex justify-center items-center gap-2"
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Send Inquiry <Send size={18} />
                                </motion.button>

                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Typical response time: <span className="text-gold-400 font-semibold">2 hours</span>
                                </p>
                            </motion.form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Image Gallery Modal */}
            {showGallery && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowGallery(false)}
                >
                    <div
                        className="relative max-w-5xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowGallery(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gold-400 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image Container */}
                        <div className="relative bg-navy-900 rounded-lg overflow-hidden">
                            <img
                                src={property.images?.[currentImageIndex] || property.coverImage}
                                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                                className="w-full h-[70vh] object-contain"
                            />

                            {/* Navigation Arrows */}
                            {property.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-navy-800/80 hover:bg-navy-700 text-white p-3 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-navy-800/80 hover:bg-navy-700 text-white p-3 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-navy-800/80 text-white px-4 py-2 rounded-full text-sm">
                                {currentImageIndex + 1} / {property.images?.length || 1}
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        {property.images?.length > 1 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                {property.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                            ? 'border-gold-400 scale-110'
                                            : 'border-navy-700 hover:border-gold-400/50'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default PropertyDetail;
