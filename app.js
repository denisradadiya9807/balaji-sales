var dotenv = require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var helper = require('./utility/helper');
app.use(logger('dev'));
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.set('runValidators', true);
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
}).on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
const adminpath = [
  { path: '/auth', routesFile: 'auth' },
  { path: '/role', routesFile: 'role' },

]
const auths = [
  { path: '/auth', routesFile: 'auth' },
]

const userspath = [
  { path: '/route', routesFile: 'route' },
  { path: '/products', routesFile: 'products' },
  { path: '/addtocart', routesFile: 'addtocart' },
  { path: '/order', routesFile: 'order' },
]

userspath.forEach((userspath) => {
  app.use('/users' + userspath.path, require('./routes/users/' + userspath.routesFile));
});

adminpath.forEach((adminpath) => {
  app.use('/Admin' + adminpath.path, require('./routes/Admin/' + adminpath.routesFile));
});

auths.forEach((auths) => {
  app.use('/registeruser' + auths.path, require('./routes/' + auths.routesFile));
});
// console.log("pass->", helper.passwordDecryptor("U2FsdGVkX19rzixDbdp7hX0VsP1ObbdCEu1qm9TGyBn/3wedtVnD2bOqawPkzpE8Vb+Q03z6Hf3CeQfpOGZkqPOHGVk/S4301UkfdCfmXaEwNe6ttPc/QP5/ZvqNgExm7y64M8PqGEb/SqFfUWaoKg=="));

module.exports = app;
