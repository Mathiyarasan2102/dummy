const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    refresh,
    getMe,
    updateUserProfile,
    upgradeToAgent
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/logout', logoutUser);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.post('/upgrade-agent', protect, upgradeToAgent);

module.exports = router;
