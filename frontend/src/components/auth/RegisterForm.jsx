import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../../store/usersApiSlice';
import { setCredentials } from '../../store/authSlice';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import GoogleLoginBtn from './GoogleLoginBtn';
import toast from 'react-hot-toast';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [register, { isLoading, error }] = useRegisterMutation();
    const { user } = useSelector((state) => state.auth);

    const [searchParams] = useSearchParams();
    const from = searchParams.get('redirect') || location.state?.from?.pathname || '/';
    const isSeller = searchParams.get('isSeller') === 'true';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [navigate, user, from]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const userData = {
                name,
                email,
                password,
                role: isSeller ? 'agent' : 'user'
            };
            const res = await register(userData).unwrap();
            dispatch(setCredentials({
                user: {
                    _id: res._id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    avatar: res.avatar
                },
                token: res.token
            }));
            toast.success(`Welcome, ${res.name}! Your account has been created.`);
            navigate(isSeller ? '/seller/dashboard' : from, { replace: true });
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="bg-navy-800 p-8 rounded-lg shadow-xl border border-navy-700 w-full max-w-md">
            <h1 className="text-3xl font-serif text-center text-gold-400 mb-6">
                {isSeller ? 'Become a LuxeEstate Agent' : 'Create Account'}
            </h1>
            {error && (error?.data?.message || error.error) && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center">
                    {error?.data?.message || error.error}
                    {(error?.data?.message === 'User already exists' || error.error === 'User already exists') && (
                        <div className="mt-1">
                            <Link to={`/login${isSeller ? '?isSeller=true' : ''}`} className="text-gold-400 hover:text-gold-500 font-medium ml-1">
                                Login here
                            </Link>
                        </div>
                    )}
                </div>
            )}
            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input
                        type="text"
                        className="input-field mt-1"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Email Address</label>
                    <input
                        type="email"
                        className="input-field mt-1"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
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
                        autoComplete="new-password"
                        required
                        minLength="6"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                    <input
                        type="password"
                        className="input-field mt-1"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        minLength="6"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary"
                >
                    {isLoading ? 'Loading...' : 'Sign Up'}
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
                <GoogleLoginBtn divId="google_register" />
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
                Already have an account? <Link to={`/login${isSeller ? '?isSeller=true' : ''}`} className="text-gold-400 hover:text-gold-500">Login</Link>
            </p>
        </div>
    );
};

export default RegisterForm;
