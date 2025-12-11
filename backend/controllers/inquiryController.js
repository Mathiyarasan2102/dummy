const asyncHandler = require('../middleware/asyncHandler');
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private
const createInquiry = asyncHandler(async (req, res) => {
    const { propertyId, message } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    const inquiry = await Inquiry.create({
        propertyId,
        userId: req.user._id,
        message
    });

    // Increment inquiry count on property
    property.stats.inquiries += 1;
    await property.save();

    const populatedInquiry = await Inquiry.findById(inquiry._id)
        .populate('userId', 'name email')
        .populate('propertyId', 'title');

    res.status(201).json(populatedInquiry);
});

// @desc    Get agent's inquiries
// @route   GET /api/inquiries/agent
// @access  Private (Agent/Admin)
const getAgentInquiries = asyncHandler(async (req, res) => {
    // Find all properties owned by the agent
    const properties = await Property.find({ agentId: req.user._id }).select('_id');
    const propertyIds = properties.map(p => p._id);

    // Find all inquiries for those properties
    const inquiries = await Inquiry.find({ propertyId: { $in: propertyIds } })
        .populate('userId', 'name email')
        .populate('propertyId', 'title')
        .sort({ createdAt: -1 });

    res.json(inquiries);
});

// @desc    Get user's inquiries
// @route   GET /api/inquiries/my
// @access  Private
const getUserInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.find({ userId: req.user._id })
        .populate('propertyId', 'title coverImage')
        .sort({ createdAt: -1 });

    res.json(inquiries);
});

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private (Agent/Admin)
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id).populate('propertyId');

    if (!inquiry) {
        res.status(404);
        throw new Error('Inquiry not found');
    }

    // Check if user owns the property
    if (inquiry.propertyId.agentId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update this inquiry');
    }

    inquiry.status = req.body.status || inquiry.status;
    await inquiry.save();

    const updatedInquiry = await Inquiry.findById(inquiry._id)
        .populate('userId', 'name email')
        .populate('propertyId', 'title');

    res.json(updatedInquiry);
});

module.exports = {
    createInquiry,
    getAgentInquiries,
    getUserInquiries,
    updateInquiryStatus
};
