// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const credentials = {
//     API_Key: "147332499338278",
//     API_Secret: "QBb-Dyu2zkOB-PkwKz7O8bw7b1s",
//     CLOUD_NAME: "mycloud123"
// };
// // const storage = new CloudinaryStorage({
// //     cloudinary: cloudinary,
// //     params: {
// //         folder: 'product_images', // Folder in Cloudinary
// //         allowed_formats: ['jpg', 'png', 'jpeg'],
// //         transformation: [{ width: 500, height: 500, crop: 'limit' }]
// //     },
// // });
// const cloudinarya = credentials;
// async function saveMultipart(buffer) {
//     let promise = new Promise(function (resolve, reject) {
//         // let newContentType = contentType.split(";");
//         let blobName = "";

//         const Bucket = cloudinarya.CLOUD_NAME;
//         const Key = blobName;
//         const Body = buffer;
//         const target = { Bucket, Key, Body };
//         if (blobName != "") {
//             try {
//                 const parallelUploads3 = new Upload({
//                     client: cloudinarya,
//                     queueSize: 4,
//                     partSize: 1024 * 1024 * 5,
//                     leavePartsOnError: false,
//                     params: target,
//                 });
//                 parallelUploads3.on("httpUploadProgress", (progress) => { });
//                 parallelUploads3.done().then((response) => {
//                     resolve({ msg: 'file uploaded successfully', data: response });
//                 }).catch((error) => {
//                     reject(new Error({ msg: 'An error occurred while completing the multipart upload' }));
//                 });
//             } catch (error) {
//                 reject(new Error({ msg: 'An error occurred while completing the multipart upload' }));
//             }
//         } else {
//             reject(new Error({ msg: 'Invalid file name to upload file on cloud' }));
//         }
//     });
//     return promise;
// };

// module.exports = { cloudinarya, saveMultipart };


import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// const express = require('express');
// const { v2: cloudinary } = require("cloudinary");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");
// require("dotenv").config();

dotenv.config();


// 🔹 Configure Cloudinary
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_Key,
    api_secret: process.env.CLOUDINARY_API_Secret,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// 🔹 Setup Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Cloudinary folder name
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        public_id: (req, file) => file.originalname.split('.')[0] + '-' + Date.now()
    },
});
const upload = multer({ storage, limits: { fileSize: 5 * 2048 * 2048 } });


cloudinary.api.ping((error, result) => {
    console.log("Ping error:", error);
    console.log("Ping result:", result);
});

// Export both cloudinary and upload
export { cloudinary, upload };





// 🔹 Route to upload image
// app.post("/upload", upload.single("image"), (req, res) => {
//     try {
//         // File is automatically uploaded to Cloudinary
//         return res.json({
//             success: true,
//             url: req.file.path, // Cloudinary URL
//             public_id: req.file.filename,
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// });


