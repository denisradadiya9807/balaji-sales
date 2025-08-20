var mongoose = require('mongoose');
var mongosepaginate = require('mongoose-paginate-v2');
let auth = new mongoose.Schema({
    Route: {
        type: String,
        require: true
    },
    roleid: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        require: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email format',
        },
    },
    Username: {
        type: String,
        require: true
    },
    Password: {
        type: String,
        require: true
    },
    Shop_Name: {
        type: String,
        require: true
    },
    Shop_Owner_Name: {
        type: String,
        require: true
    },
    Mobile_Number: {
        type: String,
        require: true,
        match: [/^\d{10}$/, 'Please Enter valid 10-Digit Number...']
    },
    Alternate_Mobile_Number: {
        type: String
    },
    Address: {
        type: String
    },
    Status: {
        type: Boolean,
        require: true
    }
})
auth.plugin(mongosepaginate);
module.exports = auth;