import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-navy-900 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-navy-900 border-t border-navy-800 py-12 text-gray-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="text-gold-400 font-serif text-xl font-bold mb-4">LuxeEstate</h4>
                        <p className="text-sm">Redefining luxury living with the world's most exclusive properties.</p>
                    </div>
                    <div>
                        <h5 className="text-cream font-bold mb-4">Quick Links</h5>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-gold-400 transition-colors">Properties</a></li>
                            <li><a href="#" className="hover:text-gold-400 transition-colors">Agents</a></li>
                            <li><a href="#" className="hover:text-gold-400 transition-colors">About Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-cream font-bold mb-4">Legal</h5>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-cream font-bold mb-4">Newsletter</h5>
                        <div className="flex">
                            <input type="email" placeholder="Your email" className="bg-navy-800 text-white px-3 py-2 text-sm rounded-l focus:outline-none border border-navy-700 w-full" />
                            <button className="bg-gold-400 text-navy-900 px-3 py-2 text-sm font-bold rounded-r hover:bg-gold-500">Sub</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-navy-800 text-center text-sm">
                    &copy; {new Date().getFullYear()} LuxeEstate. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
