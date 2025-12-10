const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '24h', // 24 hours for better UX
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

module.exports = { generateAccessToken, generateRefreshToken };
