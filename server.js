var express = require('express');
var bodyParser = require('body-parser');

var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');

var session      = require('express-session');

// create express app
var app = express();


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())


// Configuring the database
var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');

mongoose.connect(dbConfig.url, {
   
});

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(session({ secret: 'loveontheroll',
					saveUninitialized: true,
					resave: true
				})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// define a simple route
app.get('/', function(req, res){
    res.json({"message": "Get Rich Or Die Trying"});
});

// Require Notes routes
require('./api/routes/registerRoute.js')(app, passport);
   require('./config/passport')(passport);

// listen for requests
app.listen(8080, function(){
    console.log("Server is listening on port 3000");
});
