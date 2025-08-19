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
const shopowner = [
  { path: '/auth', routesFile: 'auth' },
]
adminpath.forEach((adminpath) => {
  app.use('/Admin' + adminpath.path, require('./routes/Admin/' + adminpath.routesFile));
});

shopowner.forEach((shopowner) => {
  app.use('/shopowner' + shopowner.path, require('./routes/shopowner/' + shopowner.routesFile));
});

module.exports = app;
