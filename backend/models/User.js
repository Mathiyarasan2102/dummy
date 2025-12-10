const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: function () { return !this.googleId; }, // Required if not Google login
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/v1578587606/placeholder_jwb00i.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'agent', 'admin'],
        default: 'user'
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }]
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    // Users creating account via Google might not have a password
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
