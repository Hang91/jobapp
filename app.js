var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var json2csv = require('json2csv');

var flash = require('connect-flash');
/*using mongoose*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/eventapp',{
//   socketTimeoutMS: 0,
//   keepAlive: true,
//   reconnectTries: 30,
//   reconnectInterval: 5000
// });
// var db = mongoose.connection;
// db.on('error',console.error.bind(console,'connection error:'));
// db.once('open',function(){
//   console.log('MongoDB connected');
// });



mongoose.connect('mongodb://localhost/eventapp');
var db = mongoose.connection;
db.on('error', function (err) {
    // If first connect fails because mongod is down, try again later.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
        console.log(new Date(), String(err));

        // Wait for a bit, then try to connect again
        setTimeout(function () {
            console.log("Retrying first connect...");
            db.open('mongodb://localhost/eventapp').catch(() => {});
            // Why the empty catch?
            // Well, errors thrown by db.open() will also be passed to .on('error'),
            // so we can handle them there, no need to log anything in the catch here.
            // But we still need this empty catch to avoid unhandled rejections.
        }, 20 * 1000);
    } else {
        // Some other error occurred.  Log it.
        console.error(new Date(), String(err));
    }
});

db.once('open', function () {
    console.log("Connection to db established.");
});


var routes = require('./routes/index');
var users = require('./routes/users');
var jobs = require('./routes/jobs');
var search = require('./routes/search');
var manage = require('./routes/manage');

var app = express();

//view engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//express session middleware
app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave: true
}));

//passport middlewave
app.use(passport.initialize());
app.use(passport.session());

//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect-flash middleware
app.use(flash());
app.use(function(req, res, next){
	res.locals.messages = require('express-messages')(req, res);
	next();
});


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


//define routes
app.use('/', routes);
app.use('/users', users);
app.use('/jobs', jobs);
app.use('/search', search);
app.use('/manage',manage);

app.listen(3000);
console.log('server started on port 3000');



















