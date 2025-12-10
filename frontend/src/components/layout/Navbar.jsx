import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../store/usersApiSlice';
import { logOut } from '../../store/authSlice';
import { Menu, X, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(logOut());
            navigate('/login');
            setIsOpen(false);
        }
    };

    return (
        <nav className="bg-navy-900 border-b border-navy-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-gold-400 font-serif text-2xl font-bold">LuxeEstate</span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link to="/" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                            <Link to="/properties" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Properties</Link>
                            <Link to="/about" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                            <Link to="/contact" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
                        </div>
                    </div>
                    <div className="hidden sm:flex sm:items-center">
                        {user ? (
                            <div className="ml-3 relative flex items-center space-x-4">
                                <Link to="/dashboard" className="text-cream text-sm hover:text-gold-400 transition-colors">Welcome, {user.name}</Link>

                                {user.avatar && (
                                    <Link to="/dashboard">
                                        <img
                                            className="h-8 w-8 rounded-full border border-gold-400 object-cover"
                                            src={user.avatar}
                                            alt={user.name}
                                        />
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-cream hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                                <Link to="/register" className="bg-gold-400 text-navy-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gold-500 transition-colors shadow-lg hover:shadow-gold-400/20">Register</Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-navy-700 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden bg-navy-800 border-t border-navy-700 absolute w-full left-0">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-navy-700">Home</Link>
                        <Link to="/properties" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Properties</Link>
                        {!user && (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Register</Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">My Dashboard</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
