const express = require('express');
const router = express.Router();
const {
    toggleWishlist,
    getWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:propertyId').put(protect, toggleWishlist);

module.exports = router;
