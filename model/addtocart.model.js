var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');
var addtocart = new mongoose.Schema({
    products: [
        {
            productid: { type: String },
            quantity: { type: Number, default: 1 },
            price: { type: Number, default: 0 }, // keep price for snapshot
            total: { type: Number, default: 0 },
            type: { type: String, enum: ["Patti", "Carton"], require: true },
        }
    ],
    grandTotal: { type: Number, default: 0 },
    userid: {
        type: String
    },
    productid: {
        type: String
    }
})
addtocart.plugin(mongoosepaginate);
module.exports = addtocart;
