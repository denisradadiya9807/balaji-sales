const mongoose = require('mongoose');
const adminmodel = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    roleid: {
        type: String,
        require: true
    }

});
module.exports = adminmodel;