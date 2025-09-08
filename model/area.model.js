var mongoose = require('mongoose');
var mongosepaginate = require('mongoose-paginate-v2');
let category = new mongoose.Schema({
    Area_Name: {
        type: String,
        require: true
    },

})
category.plugin(mongosepaginate);
module.exports = category; 