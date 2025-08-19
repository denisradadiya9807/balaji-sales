// let mongoose = require('mongoose');
// let mongoconnection = mongoose.createConnection(process.env.MONGO_URI);
// module.exports = mongoconnection;

const mongoose = require("mongoose");

const mongoconnection = process.env.MONGO_URI;

mongoose.connect(mongoconnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
module.exports = mongoconnection;


