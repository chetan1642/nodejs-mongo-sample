var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var expressValidator  = require('express-validator');//req.checkbody()
const mongoConfig = require('./configs/mongo-config')
var indexRouter = require('./routes/index');


mongoose.connect(mongoConfig, { useNewUrlParser: true, useCreateIndex: true, },function(error){
  if(error) throw error
    console.log(`connect mongodb success`);
});

var app = express()
app.use(cors())

app.listen("3200", '0.0.0.0', ()=> {
  console.log('listen port 3200');
  })

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root          = namespace.shift(),
    formParam     = root;

    while(namespace.lenght) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//routers
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // console.log(err);
  res.status(err.status || 500).json(err);
});

module.exports = app;
