const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const credentials = {
    API_Key: "147332499338278",
    API_Secret: "QBb-Dyu2zkOB-PkwKz7O8bw7b1s",
    CLOUD_NAME: "mycloud123"
};
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'product_images', // Folder in Cloudinary
//         allowed_formats: ['jpg', 'png', 'jpeg'],
//         transformation: [{ width: 500, height: 500, crop: 'limit' }]
//     },
// });
const cloudinarya = credentials;
async function saveMultipart(buffer) {
    let promise = new Promise(function (resolve, reject) {
        // let newContentType = contentType.split(";");
        let blobName = "";

        const Bucket = cloudinarya.CLOUD_NAME;
        const Key = blobName;
        const Body = buffer;
        const target = { Bucket, Key, Body };
        if (blobName != "") {
            try {
                const parallelUploads3 = new Upload({
                    client: cloudinarya,
                    queueSize: 4,
                    partSize: 1024 * 1024 * 5,
                    leavePartsOnError: false,
                    params: target,
                });
                parallelUploads3.on("httpUploadProgress", (progress) => { });
                parallelUploads3.done().then((response) => {
                    resolve({ msg: 'file uploaded successfully', data: response });
                }).catch((error) => {
                    reject(new Error({ msg: 'An error occurred while completing the multipart upload' }));
                });
            } catch (error) {
                reject(new Error({ msg: 'An error occurred while completing the multipart upload' }));
            }
        } else {
            reject(new Error({ msg: 'Invalid file name to upload file on cloud' }));
        }
    });
    return promise;
};

module.exports = { cloudinarya, saveMultipart };
