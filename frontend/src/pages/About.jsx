import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Trophy, Globe } from 'lucide-react';

const About = () => {
    return (
        <Layout>
            {/* Hero */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-navy-900">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="About Us"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif text-cream mb-4"
                    >
                        About <span className="text-gold-400">LuxeEstate</span>
                    </motion.h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Defining the future of luxury real estate with unparalleled service and expertise.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 bg-navy-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Our Story</h2>
                            <p className="text-gray-400 mb-4 leading-relaxed">
                                Founded in 2010, LuxeEstate began with a simple mission: to connect discerning clients with the world's most extraordinary properties. what started as a boutique agency in Beverly Hills has grown into a global network of luxury real estate experts.
                            </p>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                We believe that a home is more than just a place to live—it's an expression of who you are. That's why we go beyond the transaction to understand the unique lifestyle needs of each client.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[400px] rounded-lg overflow-hidden border border-navy-700"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Our Office"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-navy-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <Globe className="mx-auto text-gold-400 mb-4" size={32} />
                            <div className="text-3xl font-bold text-cream mb-1">15+</div>
                            <div className="text-sm text-gray-400">Countries</div>
                        </div>
                        <div>
                            <Users className="mx-auto text-gold-400 mb-4" size={32} />
                            <div className="text-3xl font-bold text-cream mb-1">2,000+</div>
                            <div className="text-sm text-gray-400">Happy Clients</div>
                        </div>
                        <div>
                            <CheckCircle className="mx-auto text-gold-400 mb-4" size={32} />
                            <div className="text-3xl font-bold text-cream mb-1">500+</div>
                            <div className="text-sm text-gray-400">Properties Sold</div>
                        </div>
                        <div>
                            <Trophy className="mx-auto text-gold-400 mb-4" size={32} />
                            <div className="text-3xl font-bold text-cream mb-1">25</div>
                            <div className="text-sm text-gray-400">Awards Won</div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default About;
