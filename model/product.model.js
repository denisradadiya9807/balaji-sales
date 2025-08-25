let mongoose = require('mongoose');
let mongoosepaginate = require('mongoose-paginate-v2');
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
    // patti: {
    //     type: String,
    //     require: true
    // },
    Quantity_patti: {
        type: Number,
    },
    // Single_pcs: {
    //     type: String,
    //     require: true
    // },
    price: {
        type: Number,
        require: true
    },
    QtyInCartoon: {
        type: Number,
        require: true
    },
    product_type: {
        type: String,
        enum: ['Single_pcs', 'patti']
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
    }
});
productadd.plugin(mongoosepaginate);
module.exports = productadd;