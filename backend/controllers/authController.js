const User = require('../models/User');
const client = require('../utils/googleClient');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        if (user) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Send refresh token in cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: accessToken
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: accessToken
            });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, picture, sub } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({
            $or: [{ email }, { googleId: sub }]
        });

        if (!user) {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId: sub,
                avatar: picture,
                role: 'user', // Default role
                // Password is not required for google users
            });
        } else {
            // Update avatar if needed or just continue
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: accessToken
        });

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
}

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const accessToken = generateAccessToken(decoded.id);

        res.json({ token: accessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden' });
    }
}

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get Me
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        const accessToken = generateAccessToken(updatedUser._id);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            token: accessToken
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    refresh,
    getMe,
    updateUserProfile
};
