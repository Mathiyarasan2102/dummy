const express = require('express');
const router = express.Router();
const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getProperties)
    .post(protect, authorize('agent', 'admin'), upload.array('images', 5), createProperty);

router.route('/:slug') // Note: getProperty uses slug, others might use ID. 
    // But update/delete typically use ID. 
    // Let's separate if needed, but for now assuming slug is unique enough? 
    // No, update/delete usually uses ID in params.
    // Let's keep get by slug.
    .get(getProperty);

router.route('/:id')
    .put(protect, authorize('agent', 'admin'), upload.array('images', 5), updateProperty)
    .delete(protect, authorize('agent', 'admin'), deleteProperty);

module.exports = router;
