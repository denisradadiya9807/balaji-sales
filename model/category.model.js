var mongoose = require('mongoose');
var mongosepaginate = require('mongoose-paginate-v2');
let category = new mongoose.Schema({
    category_name: {
        type: String,
        require: true
    },

})
category.plugin(mongosepaginate);
module.exports = category; 