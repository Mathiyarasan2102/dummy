import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../store/usersApiSlice';
import { setCredentials } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginBtn from '../components/auth/GoogleLoginBtn';
import Layout from '../components/layout/Layout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading, error }] = useLoginMutation();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [navigate, user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout>
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <div className="w-full max-w-md bg-navy-800 p-8 rounded-lg shadow-xl border border-navy-700">
                    <h1 className="text-3xl font-serif text-center text-gold-400 mb-6">Welcome Back</h1>
                    {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center">{error?.data?.message || error.error}</div>}
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input
                                type="email"
                                className="input-field mt-1"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                className="input-field mt-1"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary"
                        >
                            {isLoading ? 'Loading...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-navy-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-navy-800 text-gray-400">Or continue with</span>
                            </div>
                        </div>
                        <GoogleLoginBtn />
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        New Customer? <Link to="/register" className="text-gold-400 hover:text-gold-500">Register</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
