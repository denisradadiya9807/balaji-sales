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
const auth = [
  { path: '/auth', routesFile: 'auth' },
]

const userspath = [
  { path: '/route', routesFile: 'route' },
  { path: '/products', routesFile: 'products' },
  { path: '/addtocart', routesFile: 'addtocart' },
]

userspath.forEach((userspath) => {
  app.use('/users' + userspath.path, require('./routes/users/' + userspath.routesFile));
});

adminpath.forEach((adminpath) => {
  app.use('/Admin' + adminpath.path, require('./routes/Admin/' + adminpath.routesFile));
});

auth.forEach((auth) => {
  app.use('' + auth.path, require('./routes/' + auth.routesFile));
});
// console.log("pass->", helper.passwordDecryptor("U2FsdGVkX19DjGnjBkrf8blbhrCK3KyJkxVPkviOW3K8I3rnhE9PIElt96zqsmhq7/B9GERPOv3VfspIQc37lrCS2yhIYjMYudVCkQH9nCxcpUNBMdpVQrC6N7hPKH4xVdWBokzn1lP8c5sgvt56EA=="));

module.exports = app;
