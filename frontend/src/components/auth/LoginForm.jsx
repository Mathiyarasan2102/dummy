import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../store/usersApiSlice';
import { setCredentials } from '../../store/authSlice';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import GoogleLoginBtn from './GoogleLoginBtn';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [login, { isLoading, error }] = useLoginMutation();
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
        try {
            const res = await login({ email, password }).unwrap();
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
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-navy-800 px-8 py-6 rounded-lg shadow-xl border border-navy-700 w-full max-w-md">
            <h1 className="text-3xl font-serif text-center text-gold-400 mb-4">
                {isSeller ? 'Agent Login' : 'Welcome Back'}
            </h1>
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
                        required
                        minLength="6"
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
                <GoogleLoginBtn divId="google_login" />
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
                {isSeller ? 'New Agent?' : 'New Customer?'} <Link to={`/register${isSeller ? '?isSeller=true' : ''}`} className="text-gold-400 hover:text-gold-500">Register</Link>
            </p>
        </div>
    );
};

export default LoginForm;
