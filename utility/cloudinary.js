const cloudinary = require("cloudinary").v2;

cloudinary.config({
    API_Key: "147332499338278",
    API_Secret: "QBb-Dyu2zkOB-PkwKz7O8bw7b1s",
    CLOUD_NAME: "mycloud123"
});

module.exports = cloudinary;
