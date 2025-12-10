const express = require('express');
const router = express.Router();
const {
    createInquiry,
    getMyInquiries,
    getAgentInquiries
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createInquiry);
router.get('/my', getMyInquiries);
router.get('/agent', authorize('agent', 'admin'), getAgentInquiries);

module.exports = router;
