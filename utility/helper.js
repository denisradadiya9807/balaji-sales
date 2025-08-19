const jwt = require('jsonwebtoken');
var CryptoJS = require('crypto-js');
const JWTSECRET = 'balajisales';
const responseManager = require('./response.manager');
const user = require('../model/reset.model');
exports.validateToken = async (token) => {
    try {
        const decoded = jwt.verify(token, JWTSECRET);
        return decoded;
    } catch (error) {
        console.error('Token validation error:', error);
        return null;
    }
};
exports.generateaccessToken = (admin) => {
    return jwt.sign(
        { adminIdL: admin.adminId },
        { database: admin.database },
        process.env.JWTSECRET,
    );
};
exports.generateAccessToken = async (adminData) => {
    return jwt.sign(adminData, process.env.JWT_SECRET, {});
};
exports.authenticateToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, auth) => {
            if (err) {
                // console.log("err->", err);
                return responseManager.unauthorisedRequest(res);
            } else {
                // console.log("auth->", auth);
                req.token = auth;
                // console.log("Token received:", req.token);
            }
        });
        next();
    } else {
        next();
        // return responseManager.unauthorisedRequest(res);
    }
}
exports.passwordDecryptor = async (passwordKeyDecrypt) => {
    try {
        var decLayer1 = CryptoJS.TripleDES.decrypt(passwordKeyDecrypt, process.env.PASSWORD_ENCRYPTION_SECRET);
        var deciphertext1 = decLayer1.toString(CryptoJS.enc.Utf8);
        var decLayer2 = CryptoJS.DES.decrypt(deciphertext1, process.env.PASSWORD_ENCRYPTION_SECRET);
        var deciphertext2 = decLayer2.toString(CryptoJS.enc.Utf8);
        var decLayer3 = CryptoJS.AES.decrypt(deciphertext2, process.env.PASSWORD_ENCRYPTION_SECRET);
        var finalDecPassword = decLayer3.toString(CryptoJS.enc.Utf8);
        return finalDecPassword;
    } catch (err) {
        throw err;
    }
};
exports.passwordEncryptor = async (passwordKeyEncrypt) => {
    try {
        var encLayer1 = CryptoJS.AES.encrypt(passwordKeyEncrypt, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        var encLayer2 = CryptoJS.DES.encrypt(encLayer1, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        var finalEncPassword = CryptoJS.TripleDES.encrypt(encLayer2, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        return finalEncPassword;
    } catch (err) {
        throw err;
    }
};

exports.verifyotp = async ({ email, otpcode }) => {
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
exports.generateOtp = () => {
    const length = 6
    const charaters = '0123456789'
    let otp = ''
    for (let o = 0; o < length; o++) {
        const getRandomIndex = Math.floor(Math.random() * charaters.length)
        otp += charaters[getRandomIndex]
    }
    return otp
};


