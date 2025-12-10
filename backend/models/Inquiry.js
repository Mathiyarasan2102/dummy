const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    scheduledVisit: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'contacted', 'closed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);
