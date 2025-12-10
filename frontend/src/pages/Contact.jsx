import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message. We will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <Layout>
            <section className="pt-20 pb-10 bg-navy-900">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-cream mb-4">Contact Us</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Have a question about a property or want to list with us? Our team is ready to assist you.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-navy-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-navy-800 p-8 rounded-lg border border-navy-700">
                                <h3 className="text-xl font-serif text-cream mb-6">Get in Touch</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <MapPin className="text-gold-400 mt-1 mr-4" size={24} />
                                        <div>
                                            <h4 className="text-white font-medium">Headquarters</h4>
                                            <p className="text-gray-400">123 Luxury Lane, Beverly Hills<br />CA 90210, USA</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="text-gold-400 mr-4" size={24} />
                                        <div>
                                            <h4 className="text-white font-medium">Phone</h4>
                                            <p className="text-gray-400">+1 (555) 123-4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="text-gold-400 mr-4" size={24} />
                                        <div>
                                            <h4 className="text-white font-medium">Email</h4>
                                            <p className="text-gray-400">contact@luxeestate.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[300px] bg-navy-800 rounded-lg border border-navy-700 overflow-hidden relative">
                                {/* Placeholder for Map */}
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Map"
                                    className="w-full h-full object-cover opacity-50"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-navy-900/80 px-4 py-2 rounded text-gold-400 font-medium backdrop-blur">
                                        View on Google Maps
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-navy-800 p-8 rounded-lg border border-navy-700">
                            <h3 className="text-xl font-serif text-cream mb-6">Send us a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                                    <textarea
                                        rows="5"
                                        className="input-field"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Contact;
