let mongoose = require('mongoose');
let mongoosepaginate = require('mongoose-paginate-v2');
let varientsadd = new mongoose.Schema({
    type: { type: String, enum: ["Patti", "Carton"], require: true },
    qty: Number,   // e.g. 1 for Patti, 16 for Carton
    price: Number,
    totalPrice: { type: Number } // qty * price
}, { _id: true });
let productadd = new mongoose.Schema({
    category: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    Product_name: {
        type: String,
        require: true
    },
    Description: {
        type: String,
        require: true
    },
    orignalAmount: {
        type: Number,
        require: true
    },

    variants: [varientsadd],

    totalPricePatti: {
        type: Number, default: 0
    },
    totalPriceCarton: {
        type: Number, default: 0
    },
    totalAmount: {
        type: Number,
        require: true
    },
    instock: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    },
    productid: {
        type: String
    },
    orignalAmount: {
        type: Number,
        require: true
    },
    imageUrl: {
        type: String,
    },
    order: {
        type: Number
    },
    isActive: { type: Boolean, default: false }
});
productadd.plugin(mongoosepaginate);
module.exports = productadd;