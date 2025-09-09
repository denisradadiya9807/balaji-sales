var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');
var addtocart = new mongoose.Schema({
    productid: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true,
        default: 1
    }
})
addtocart.plugin(mongoosepaginate);
module.exports = addtocart;
