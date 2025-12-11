import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
    const location = useLocation();
    const isLogin = location.pathname === '/login' || location.pathname === '/login/'; // Strict check or handle query params if needed, but 'includes' acts weird if path is /login?foo

    return (
        <Layout>
            {/* Removed overflow-hidden to allow scrolling if card expands, and switched to margin-auto centering for safer vertical alignment */}
            <div className="min-h-[calc(100vh-64px)] py-12 flex bg-navy-900">
                <div style={{ perspective: '1000px' }} className="w-full max-w-md h-[850px] m-auto">
                    {/* Card Container */}
                    <motion.div
                        className="relative w-full h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                        initial={{ rotateY: location.pathname.includes('/register') ? 180 : 0 }}
                        animate={{ rotateY: location.pathname.includes('/register') ? 180 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {/* Front Face (Login) */}
                        <div
                            className="absolute inset-0 w-full h-full flex items-start justify-center pt-16"
                            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                        >
                            <LoginForm />
                        </div>

                        {/* Back Face (Register) */}
                        <div
                            className="absolute inset-0 w-full h-full flex items-start justify-center pt-16"
                            style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                            }}
                        >
                            <RegisterForm />
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default AuthPage;
