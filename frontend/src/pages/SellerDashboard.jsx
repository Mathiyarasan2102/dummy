import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Home, BarChart2, Briefcase, Loader, ShieldCheck, Mail, CheckCircle, Smartphone
} from 'lucide-react';
import {
    useGetAgentPropertiesQuery,
    useDeletePropertyMutation,
} from '../store/propertiesApiSlice';
import { useGetAgentInquiriesQuery, useUpdateInquiryStatusMutation } from '../store/inquiriesApiSlice';
import { useUpgradeToAgentMutation } from '../store/usersApiSlice';
import { setCredentials } from '../store/authSlice';
import AnimatedPage from '../components/ui/AnimatedPage';
import { AnimatedGrid, AnimatedItem } from '../components/ui/AnimatedGrid';
import PropertyCard from '../components/Seller/PropertyCard';
import StatsCard from '../components/Seller/StatsCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { MOCK_PROPERTIES, MOCK_INQUIRIES } from '../data/mockData';

const UpgradeToAgent = () => {
    const [upgrade, { isLoading }] = useUpgradeToAgentMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUpgrade = async () => {
        try {
            const res = await upgrade().unwrap();
            dispatch(setCredentials({ user: res, token: res.token }));
            toast.success("Welcome aboard! You are now an Agent.");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to upgrade.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <ShieldCheck size={64} className="text-gold-400 mb-6" />
            <h1 className="text-4xl font-serif text-cream mb-4">Become a LuxeEstate Agent</h1>
            <p className="text-gray-400 max-w-lg mb-8">
                Unlock the ability to list your own properties, manage leads, and access detailed analytics.
                Join our exclusive network of premium real estate agents.
            </p>
            <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="bg-gold-400 text-navy-950 px-8 py-3 rounded-lg font-bold hover:bg-gold-300 transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Processing...' : 'Upgrade Now'}
            </button>
        </div>
    );
};

const SellerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch real data
    const {
        data: realProperties,
        isLoading: isPropertiesLoading,
        refetch
    } = useGetAgentPropertiesQuery(undefined, {
        skip: !user || user.role !== 'agent'
    });

    const {
        data: realInquiries,
        isLoading: isInquiriesLoading
    } = useGetAgentInquiriesQuery(undefined, {
        skip: !user || user.role !== 'agent'
    });

    // Use Mock Data for specific user
    const isDemouser = user?.email === 'arasan@gmail.com';

    // Fallback to empty array if data is loading or undefined, but override for demo user
    const properties = isDemouser ? MOCK_PROPERTIES : (realProperties || []);
    const inquiries = isDemouser ? MOCK_INQUIRIES : (realInquiries || []);

    // Note: We bypass loading states for demo user to show data immediately
    const isLoading = !isDemouser && (isPropertiesLoading || isInquiriesLoading);

    const [deleteProperty] = useDeletePropertyMutation();
    const [updateInquiryStatus] = useUpdateInquiryStatusMutation();

    if (!user) return null;

    if (user.role !== 'agent' && user.role !== 'admin') {
        return (
            <AnimatedPage className="container mx-auto px-4 py-8">
                <UpgradeToAgent />
            </AnimatedPage>
        );
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await deleteProperty(id).unwrap();
                toast.success('Property deleted');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || 'Delete failed');
            }
        }
    };

    const handleMarkAsRead = async (id, currentStatus) => {
        if (currentStatus !== 'pending') return;
        try {
            await updateInquiryStatus({ id, status: 'reviewed' }).unwrap();
            toast.success('Marked as read');
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    // Filter properties based on search
    const filteredProperties = properties?.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate Stats
    const totalListings = properties?.length || 0;
    const totalViews = properties?.reduce((acc, curr) => acc + (curr.stats?.views || 0), 0) || 0;
    const totalInquiries = inquiries?.length || 0;
    const pendingInquiries = inquiries?.filter(i => i.status === 'pending').length || 0;

    // Dummy Analytics Data (Derived from actual count but distributed for chart)
    const analyticsData = [
        { name: 'Mon', views: Math.floor(totalViews * 0.1), inquiries: Math.floor(totalInquiries * 0.1) },
        { name: 'Tue', views: Math.floor(totalViews * 0.15), inquiries: Math.floor(totalInquiries * 0.05) },
        { name: 'Wed', views: Math.floor(totalViews * 0.2), inquiries: Math.floor(totalInquiries * 0.2) },
        { name: 'Thu', views: Math.floor(totalViews * 0.1), inquiries: Math.floor(totalInquiries * 0.15) },
        { name: 'Fri', views: Math.floor(totalViews * 0.25), inquiries: Math.floor(totalInquiries * 0.3) },
        { name: 'Sat', views: Math.floor(totalViews * 0.15), inquiries: Math.floor(totalInquiries * 0.1) },
        { name: 'Sun', views: Math.floor(totalViews * 0.05), inquiries: Math.floor(totalInquiries * 0.1) },
    ];

    return (
        <AnimatedPage className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-cream">Agent Dashboard</h1>
                    <p className="text-gray-400">Welcome back, <span className="text-gold-400">{user.name}</span></p>
                </div>
                <button
                    onClick={() => navigate('/seller/add-property')}
                    className="flex items-center gap-2 bg-gold-400 text-navy-950 px-6 py-2 rounded-lg font-bold hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20"
                >
                    <Plus size={20} /> Add New Property
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6 border-b border-navy-700 mb-8 overflow-x-auto">
                {['overview', 'listings', 'inquiries', 'analytics'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-2 text-sm font-medium capitalize transition-colors relative whitespace-nowrap
                            ${activeTab === tab ? 'text-gold-400' : 'text-gray-400 hover:text-cream'}
                        `}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatsCard title="Total Listings" value={totalListings} icon={Home} trend={5} />
                            <StatsCard title="Total Views" value={totalViews} icon={BarChart2} trend={12} />
                            <StatsCard title="Total Inquiries" value={totalInquiries} icon={Briefcase} trend={8} />
                        </div>

                        {/* Recent Activity / Inquiries Preview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                                <h3 className="text-xl font-serif text-cream mb-4">Recent Inquiries</h3>
                                {inquiries?.length > 0 ? (
                                    <div className="space-y-4">
                                        {inquiries.slice(0, 3).map(inquiry => (
                                            <div key={inquiry._id} className="flex items-start gap-3 p-3 bg-navy-900/50 rounded-lg">
                                                <div className={`mt-1 w-2 h-2 rounded-full ${inquiry.status === 'pending' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                                <div>
                                                    <p className="text-cream font-bold text-sm">{inquiry.userId?.name}</p>
                                                    <p className="text-xs text-gray-400 mb-1">on {inquiry.propertyId?.title}</p>
                                                    <p className="text-xs text-gray-300 line-clamp-1 italic">"{inquiry.message}"</p>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => setActiveTab('inquiries')} className="text-gold-400 text-sm hover:underline mt-2">View All Inquiries</button>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No recent inquiries.</p>
                                )}
                            </div>

                            <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                                <h3 className="text-xl font-serif text-cream mb-4">Performance Overview</h3>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={analyticsData}>
                                            <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                                                itemStyle={{ color: '#fbbf24' }}
                                            />
                                            <Line type="monotone" dataKey="views" stroke="#fbbf24" strokeWidth={3} dot={{ fill: '#fbbf24' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'listings' && (
                    <motion.div
                        key="listings"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                            <h2 className="text-xl font-serif text-cream">My Properties</h2>
                            <input
                                type="text"
                                placeholder="Search properties..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-navy-800 border border-navy-700 text-cream px-4 py-2 rounded-lg focus:outline-none focus:border-gold-400 w-full sm:w-64"
                            />
                        </div>

                        {isPropertiesLoading ? (
                            <div className="flex justify-center py-12"><Loader className="animate-spin text-gold-400" /></div>
                        ) : filteredProperties?.length === 0 ? (
                            <div className="text-center py-12 bg-navy-800 rounded-xl border border-navy-700">
                                <Home size={48} className="mx-auto text-navy-600 mb-4" />
                                <h3 className="text-xl text-cream mb-2">No properties found</h3>
                                <p className="text-gray-400 mb-6">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'Create your first listing to get started.'}
                                </p>
                                {!searchTerm && (
                                    <button onClick={() => navigate('/seller/add-property')} className="text-gold-400 hover:underline">
                                        Create Listing
                                    </button>
                                )}
                            </div>
                        ) : (
                            <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProperties.map(property => (
                                    <AnimatedItem key={property._id}>
                                        <PropertyCard property={property} onDelete={handleDelete} />
                                    </AnimatedItem>
                                ))}
                            </AnimatedGrid>
                        )}
                    </motion.div>
                )}

                {activeTab === 'inquiries' && (
                    <motion.div
                        key="inquiries"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-serif text-cream">Inquiries</h2>
                            {pendingInquiries > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                    {pendingInquiries} New
                                </span>
                            )}
                        </div>

                        {isInquiriesLoading ? (
                            <div className="flex justify-center py-12"><Loader className="animate-spin text-gold-400" /></div>
                        ) : inquiries?.length === 0 ? (
                            <div className="text-center py-12 bg-navy-800 rounded-xl border border-navy-700">
                                <Briefcase size={48} className="mx-auto text-navy-600 mb-4" />
                                <h3 className="text-xl text-cream mb-2">No inquiries yet</h3>
                                <p className="text-gray-400">When users contact you about a property, they will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {inquiries.map((inquiry) => (
                                    <div
                                        key={inquiry._id}
                                        className={`p-6 rounded-xl border transition-all duration-300 relative overflow-hidden
                                            ${inquiry.status === 'pending' ? 'bg-navy-800 border-gold-400/50 shadow-lg shadow-gold-400/5' : 'bg-navy-800 border-navy-700 opacity-90'}
                                        `}
                                    >
                                        {inquiry.status === 'pending' && (
                                            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-3 animate-pulse"></div>
                                        )}
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                            <div>
                                                <h4 className="text-lg font-bold text-cream flex items-center gap-2">
                                                    {inquiry.propertyId?.title || 'Unknown Property'}
                                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${inquiry.status === 'pending' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
                                                        }`}>
                                                        {inquiry.status}
                                                    </span>
                                                </h4>
                                                <div className="flex items-center text-sm text-gold-400 mt-1">
                                                    <Mail size={14} className="mr-1" />
                                                    {inquiry.userId?.email}
                                                    <span className="mx-2 text-navy-600">|</span>
                                                    <span className="text-gray-400">From: {inquiry.userId?.name}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 bg-navy-900 px-3 py-1 rounded border border-navy-800 whitespace-nowrap">
                                                {new Date(inquiry.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="bg-navy-900/50 p-4 rounded-lg border border-navy-800 mb-4">
                                            <p className="text-gray-300 italic">"{inquiry.message}"</p>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <a
                                                href={`mailto:${inquiry.userId?.email}?subject=Re: Inquiry for ${inquiry.propertyId?.title}`}
                                                className="btn-primary-sm flex items-center gap-2 bg-gold-400 text-navy-900 px-4 py-2 rounded font-bold hover:bg-gold-300"
                                            >
                                                <Mail size={16} /> Reply via Email
                                            </a>
                                            {inquiry.status === 'pending' && (
                                                <button
                                                    onClick={() => handleMarkAsRead(inquiry._id, inquiry.status)}
                                                    className="flex items-center gap-2 bg-navy-700 text-cream px-4 py-2 rounded hover:bg-navy-600 transition-colors border border-navy-600"
                                                >
                                                    <CheckCircle size={16} /> Mark as Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'analytics' && (
                    <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 mb-8">
                            <h2 className="text-xl font-serif text-cream mb-6">Traffic & Engagement</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                        <XAxis dataKey="name" stroke="#cbd5e1" />
                                        <YAxis stroke="#cbd5e1" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                                            cursor={{ fill: '#334155', opacity: 0.2 }}
                                        />
                                        <Bar dataKey="views" name="Property Views" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="inquiries" name="Inquiries" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                                <h3 className="text-lg font-bold text-cream mb-4">Top Performing Properties</h3>
                                <div className="space-y-4">
                                    {[...properties || []].sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0)).slice(0, 3).map((property, idx) => (
                                        <div key={property._id} className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gold-400 text-navy-900 flex items-center justify-center font-bold">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-cream font-medium line-clamp-1">{property.title}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gold-400">
                                                <BarChart2 size={14} /> {property.stats?.views || 0}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                                <h3 className="text-lg font-bold text-cream mb-4">Quick Tips</h3>
                                <ul className="space-y-3 text-gray-400 text-sm">
                                    <li className="flex gap-2"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5"></div> Properties with high-quality photos get 3x more views.</li>
                                    <li className="flex gap-2"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5"></div> Responding to inquiries within 1 hour increases conversion by 50%.</li>
                                    <li className="flex gap-2"><div className="min-w-[6px] h-[6px] rounded-full bg-gold-400 mt-1.5"></div> Add detailed descriptions to improve search visibility.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
};

export default SellerDashboard;
