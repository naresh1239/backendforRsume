const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    passwordHash: { // Renamed for consistency
        type: String,
        required: [true, 'Password hash is required']
    },
    verification_token : {
        type : Number,
        required : true,
    },
    is_verified: {
        type: Boolean,
        default: false // Set default for easier account creation flow
    },
    token_expire_date: {
        type: Date,
        required: true
    },
    last_login: {
        type: Date,
        default: null // Default to null for new users who haven't logged in yet
    }
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('user', userSchema);
