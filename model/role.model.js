const mongoose = require('mongoose');
const mongosepaginate = require('mongoose-paginate-v2');
let permissions = new mongoose.Schema({
    displayname: {
        type: String,
        require: true
    },
    collectionname: {
        type: String,
        require: true
    },
    insertupdate: {
        type: Boolean,
        default: false
    },
    Delete: {
        type: Boolean,
        default: false
    },
    View: {
        type: Boolean,
        default: true
    },

}, { _id: false });
const rolemodel = new mongoose.Schema({
    adminid: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },
    rolename: {
        type: String,
        require: true
    },
    permissions: [permissions],

})
rolemodel.plugin(mongosepaginate);
module.exports = rolemodel;




















