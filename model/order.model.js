let mongoose = require('mongoose')
let mongoosepaginate = require('mongoose-paginate-v2');
let order = mongoose.Schema({

    cartid: {
        type: String
    },
    quantity: {
        type: number
    },
    price: {
        type: number,
        require: true
    }


});
order.plugin(mongoosepaginate);
module.exports = order
