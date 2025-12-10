const User = require('../models/User');
const Property = require('../models/Property');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Toggle wishlist item
// @route   PUT /api/users/wishlist/:propertyId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
    console.log('=== TOGGLE WISHLIST REQUEST ===');
    console.log('User ID:', req.user?._id);
    console.log('Property ID:', req.params.propertyId);

    const user = await User.findById(req.user._id);
    const propertyId = req.params.propertyId;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
        console.log('Property not found');
        res.status(404);
        throw new Error('Property not found');
    }

    // Check if already in wishlist
    if (user.wishlist.includes(propertyId)) {
        // Remove
        console.log('Removing from wishlist');
        user.wishlist = user.wishlist.filter(id => id.toString() !== propertyId);
    } else {
        // Add
        console.log('Adding to wishlist');
        user.wishlist.push(propertyId);
    }

    await user.save();
    console.log('Wishlist updated successfully');

    res.json({ wishlist: user.wishlist });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
});

module.exports = {
    toggleWishlist,
    getWishlist
};
