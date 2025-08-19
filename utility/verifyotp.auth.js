const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = 'FIRST'; // Make sure this is the same secret you use for signing tokens
const user = require('../models/reset.model');
// Token Validation Middleware
const verifyotp = async ({ email, otpcode }) => {
    try {
        const User = await user.findOne({
            email: email,
            otpcode: otpcode
        })
        if (!User) return null
        const otpExpired = new Date() > new Date(user.otp_Expiration)
        if (otpExpired) throw new error('Otp Is Expired')
        const alreadyVerified = user.is_verified === true
        if (alreadyVerified) throw new error('Email has Been Verified')
        return User
    } catch (error) {
        throw error
    }
};
module.exports = verifyotp;


