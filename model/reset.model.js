let mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h' // Token will expire after 1 hour
    }
});

module.exports = passwordResetSchema;

