var createError = require('http-errors');
var express = require('express');
const bodyParser     = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose       = require('mongoose');
var indexRouter = require('./routes/index');

const keys           = require('./config/config.js');
var cors = require('cors')

var app = express();
const session  = require('cookie-session');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({limit: '500mb',extended:true}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(({ 
	name: 'session',
    keys: [keys.session.cookieKey,keys.session.cookieKey],
    // maxAge: 24 * 60 * 60 * 1000 // 24 hours 
})));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('404', {title: " Sorry, page not found"});
});

mongoose.connect(keys.mongodb.dbstring,{ useNewUrlParser: true },()=>{
  console.log("Connected to mongoDB");
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
