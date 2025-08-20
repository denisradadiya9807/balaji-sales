const express = require('express');
const router = express.Router();
const mongoConection = require('../../utility/connection');
const constants = require('../../utility/constants');
const helper = require('../../utility/helper');
const nodemailer = require('nodemailer');
const otpModel = require('../../model/otp.model');
const registermodel = require('../../model/auth.model');
require('dotenv').config();
const responseManager = {
    onSuccess: (message, data, res) => {
        res.status(200).json({ success: true, message, data });
    },
    onError: (error, res) => {
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};
// Create a transporter for Nodemailer
exports.reset = async (req, res) => {
    const otp = helper.generateOtp();
    const otpExpiration = new Date(Date.now() + 60 * 10000);
    const { Email } = req.body;
    try {
        let primary = mongoConection.useDb(constants.balajisales);
        const userData = await primary.collection('userregisters').findOne({ Email });
        if (!userData) {
            return res.status(404).send('No user found with that email address.');
        }
        let otpRecord = {
            Email: Email,
            otpcode: otp,
            otp_Expiration: otpExpiration,
            is_varified: true
        };
        let newuser = await primary.model(constants.Model.otps, otpModel).create(otpRecord);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: true, // true for port 465, false for other ports
            auth: {
                user: 'denis.class71@gmail.com',
                pass: 'iveg bjbt xele kpso'
            },
            // logger: true,
            // debug: true
        });
        let mailDetails = {
            from: 'denis.class71@gmail.com',
            to: Email,
            subject: 'Otp Verification ',
            html: `Order MongoID : ${userData._id.toString()} - orderId : ${userData}  - Your OTP for verification is: ${otp}`
        };
        transporter.sendMail(mailDetails, function (error, data) {
            if (error) {
                return responseManager.onError(error, res);
            }
            res.status(200).json({
                message: 'Otp Sent  Successful',
                otp: otp,
                Data: newuser,
                userData: userData
            });
        });
    } catch (error) {
        console.error(error);
        return responseManager.onError(error, res);
    }
};
exports.verifyotp = async (req, res) => {
    const { Email, otpcode, is_varified } = req.body;
    let primary = mongoConection.useDb(constants.balajisales);
    try {
        // const otpRecord = await newuser.findOne({ Email, otpcode });
        let otpRecord = await primary.model(constants.Model.otps, otpModel).findOne({ Email, otpcode });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP or Email' });
        }
        // Check OTP expiration
        const otpExpired = new Date() > new Date(otpRecord.otp_Expiration);
        if (otpExpired) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        // Mark OTP as verified
        otpRecord.is_varified = true;
        res.status(200).json({
            message: 'verified Otp Success',
            Data: otpRecord,
            date: new Date()
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.setpassword = async (req, res) => {
    let primary = mongoConection.useDb(constants.balajisales);
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        return res.status(400).json({ message: " Email And Password are required" });
    }
    const encryptedPassword = await helper.passwordEncryptor(req.body.Password);
    const updatepass = await primary.model(constants.Model.userregisters, registermodel).updateOne(
        { Email }, // Filter: find the user by Email
        { $set: { Password: encryptedPassword } });// Update: set the new Password
    if (updatepass.matchedCount === 0) {
        return res.status(404).json({ message: "User with the provided Email does not exist" });
    }
    res.status(200).json({
        message: 'Password updated successfully...',
        Data: updatepass,
        Password: {
            Password: encryptedPassword
        }
    });
};










