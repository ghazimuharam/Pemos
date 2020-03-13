var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
MongoStore = require('connect-mongo')(session);
var index = require('./routes/index');
var guru = require('./routes/guru');
var siswa = require('./routes/siswa');

var app = express();
var mongoose = require('mongoose');
//
	var url = 'mongodb://localhost:27017/pilketos'
	mongoose.connect(url);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
	  console.log("Successfully Connected With MongoDB");
	});
//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
                  secret : "nootherusercanaccessthissecret",
                  resave: true,
                  saveUninitialized: true,
                  store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 1 * 24 * 60 * 60 })
                }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/guru', guru);
app.use('/siswa', siswa);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
	if(req.session){ console.log(req.session); }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
