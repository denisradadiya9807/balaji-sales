let mongoose = require('mongoose');
let mongoosepaginate = require('mongoose-paginate-v2');
let route = new mongoose.Schema({
    route_name: {
        type: String,
        require: true
    },
    gadi_number: {
        type: String,
        require: true
    },
    driver_name: {
        type: String,
        require: true
    },
    driver_number: {
        type: String,
        require: true
    },
    driver_alternet_number: {
        type: String,
        require: true
    }

});
route.plugin(mongoosepaginate);
module.exports = route;
