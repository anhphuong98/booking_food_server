var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

 // Khai bao passport va session de luu thong tin nguoi dung
// var passport = require('./middleware/passport');
var session = require('express-session');
// Goi API
var api = require('./routes/api');
var caDiApi = require('./routes/categoryDishApi');
var db = require('./models');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use passport va session
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized: true}));
// app.use(passport.initialize());
// app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);



// Chay api
api(app);
caDiApi(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// Khoi dong server

db.sequelize.sync().then(function(){
    app.listen(8080, () => {
        console.log("Server is running at localhost:8080");
    })
})

  // "username": "myadmin@mybookingserver",
    // "password": "@Pjtjamj9815101998",
    // "database": "ptpmcn_booking",
    // "host": "mybookingserver.mysql.database.azure.com",

module.exports = app;
