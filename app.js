// var dotenv = require('dotenv').config();
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


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');



// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


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

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
// console.log("pass->", helper.passwordEncryptor("Denis9807"));
module.exports = app;
