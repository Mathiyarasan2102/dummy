const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private
const createInquiry = async (req, res) => {
    try {
        const { propertyId, message } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            res.status(404);
            throw new Error('Property not found');
        }

        // Prevent inquiring on own property
        if (property.agentId.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('You cannot send inquiry to your own property');
        }

        const inquiry = await Inquiry.create({
            userId: req.user._id,
            agentId: property.agentId,
            propertyId,
            message
        });

        res.status(201).json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user inquiries (sent)
// @route   GET /api/inquiries/my
// @access  Private
const getMyInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ userId: req.user._id })
            .populate('propertyId', 'title slug coverImage price location')
            .populate('agentId', 'name email');
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get agent inquiries (received)
// @route   GET /api/inquiries/agent
// @access  Private (Agent/Admin)
const getAgentInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ agentId: req.user._id })
            .populate('userId', 'name email')
            .populate('propertyId', 'title');
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInquiry,
    getMyInquiries,
    getAgentInquiries
};
