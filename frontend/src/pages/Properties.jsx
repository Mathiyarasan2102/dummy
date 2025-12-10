import React, { useState } from 'react';
import { useGetPropertiesQuery } from '../store/propertiesApiSlice';
import Layout from '../components/layout/Layout';
import PropertyCard from '../components/properties/PropertyCard';
import { Search, Filter } from 'lucide-react';

const Properties = () => {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);

    // In a real app, I'd debounce search or use a submit
    const { data, isLoading, error } = useGetPropertiesQuery({
        search,
        type: type === 'All' ? '' : type,
        page
    });

    const propertyTypes = ['All', 'House', 'Apartment', 'Condo', 'Villa', 'Commercial', 'Land'];

    return (
        <Layout>
            <div className="bg-navy-800 py-12 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-serif text-cream text-center mb-4">Our Exclusive Collection</h1>
                    <p className="text-gray-400 text-center max-w-2xl mx-auto">Find your dream home among our curated list of premium properties.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 mb-16">
                {/* Filters */}
                <div className="bg-navy-800 p-6 rounded-lg mb-8 border border-navy-700 sticky top-20 z-10 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search location, title..."
                                className="w-full bg-navy-900 border border-navy-600 rounded pl-10 pr-4 py-2 text-cream focus:outline-none focus:border-gold-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <select
                                className="w-full md:w-48 bg-navy-900 border border-navy-600 rounded px-4 py-2 text-cream focus:outline-none focus:border-gold-400"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="" disabled>Property Type</option>
                                {propertyTypes.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-20 text-gold-400">Loading properties...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">Error loading properties</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data?.properties?.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>

                        {data?.properties?.length === 0 && (
                            <div className="text-center py-20 text-gray-400">No properties found matching your criteria.</div>
                        )}

                        {/* Simple Pagination */}
                        <div className="flex justify-center mt-12 gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 bg-navy-800 text-cream rounded disabled:opacity-50 hover:bg-navy-700"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gold-400">Page {page} of {data?.pages || 1}</span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === (data?.pages || 1)}
                                className="px-4 py-2 bg-navy-800 text-cream rounded disabled:opacity-50 hover:bg-navy-700"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Properties;
