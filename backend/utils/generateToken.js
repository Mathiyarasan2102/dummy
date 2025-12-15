const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '24h', // 24 hours for better UX
    });
};

const generateRefreshToken = (id) => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

module.exports = { generateAccessToken, generateRefreshToken };
