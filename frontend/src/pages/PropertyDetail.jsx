import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetPropertyQuery } from '../store/propertiesApiSlice';
import Layout from '../components/layout/Layout';
import { MapPin, BedDouble, Bath, Square, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyDetail = () => {
    const { slug } = useParams();
    const { data: property, isLoading, error } = useGetPropertyQuery(slug);

    // Inquiry Form State
    const [message, setMessage] = useState('');

    const handleInquiry = (e) => {
        e.preventDefault();
        alert('Inquiry feature would be connected to pure backend here via /api/inquiries');
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
                        <div className="text-3xl md:text-4xl font-bold text-gold-400 mt-4 md:mt-0">
                            ${property.price.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 bg-navy-800 p-6 rounded-lg border border-navy-700">
                            <div className="flex flex-col items-center justify-center p-4">
                                <BedDouble size={32} className="text-gold-400 mb-2" />
                                <span className="text-cream text-lg font-bold">{property.bedrooms} Bedrooms</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 border-l border-navy-700">
                                <Bath size={32} className="text-gold-400 mb-2" />
                                <span className="text-cream text-lg font-bold">{property.bathrooms} Bathrooms</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 border-l border-navy-700">
                                <Square size={32} className="text-gold-400 mb-2" />
                                <span className="text-cream text-lg font-bold">{property.areaSqft} sqft</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-navy-800 p-8 rounded-lg border border-navy-700">
                            <h2 className="text-2xl font-serif text-cream mb-4">Description</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="bg-navy-800 p-8 rounded-lg border border-navy-700">
                            <h2 className="text-2xl font-serif text-cream mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {property.amenities?.map((amenity, index) => (
                                    <div key={index} className="flex items-center text-gray-300">
                                        <div className="w-2 h-2 bg-gold-400 rounded-full mr-2"></div>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Agent */}
                    <div className="space-y-8">
                        <div className="bg-navy-800 p-6 rounded-lg border border-navy-700 sticky top-24">
                            <h3 className="text-xl font-serif text-cream mb-6">Contact Agent</h3>
                            <div className="flex items-center mb-6">
                                <img
                                    src={property.agentId?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                    alt="Agent"
                                    className="w-16 h-16 rounded-full border-2 border-gold-400 mr-4"
                                />
                                <div>
                                    <h4 className="text-lg font-bold text-cream">{property.agentId?.name || "Luxe Agent"}</h4>
                                    <p className="text-gold-400 text-sm">Senior Real Estate Agent</p>
                                </div>
                            </div>

                            <form onSubmit={handleInquiry} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                                    <textarea
                                        rows="4"
                                        className="input-field"
                                        placeholder="I am interested in this property..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2">
                                    Send Inquiry <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PropertyDetail;
