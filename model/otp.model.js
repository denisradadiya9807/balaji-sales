const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    Email: { type: String, required: true },
    otpcode: { type: String, required: true },
    otp_Expiration: { type: Date, required: true },
    is_varified: { type: Boolean, default: false }
});

module.exports = otpSchema;
