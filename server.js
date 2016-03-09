
var tunnel = require('./setup_proxy');

//require( './db_userData' );

// Load required modules
//var https = require('https'); 				// http server core module
//var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module
var path = require('path');
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');			//is object modeling for our MongoDB database
var passport = require('passport');			//stuff will help us authenticating with different methods
var flash    = require('connect-flash');	//allows for passing session flashdata messages
var session = require('client-sessions');

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');



//configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database



require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//session
app.use(session({
	  cookieName: 'session',
	  secret: 'random_string_goes_here',
	  duration: 30 * 60 * 1000,
	  activeDuration: 5 * 60 * 1000,
	}));

//console.log(__dirname);
//app.use(express.static(__dirname + "/static/"));
//app.use(express.static("http://localhost:8080/reThink/" + "/static/"));
//app.use(express.static(__dirname +'../demo', 'client.html'));

var User = require('./app/models/user');

app.get('/', function(req, res){
	//console.log('/reThink/demo/client');
		app.use(express.static(path.join(__dirname)));
		res.sendFile(path.join(__dirname, 'init.html'));
	});
		
app.get('/consent', function(req, res){
	//console.log('/reThink/demo/client');
		app.use(express.static(path.join(__dirname)));
		res.sendFile(path.join(__dirname, 'consent.html'));
	});
			

app.get('/reThink/demo/client', function(req, res){     //:id
	//console.log('/reThink/demo/client');
	/*if (req.session&&req.session.user){
		//var mongoose = require('mongoose');
        //var id = mongoose.Types.ObjectId(req.param.id);
		User.findById(user._id , function (err, user){
	//return User.find(req.params.email, function (err, user){
		if (!user) {
			res.statusCode = 404;
			return res.send({error: 'Not found' });
		}
		if (!err) {
			res.locals.user = user;
			app.use(express.static(path.join(__dirname)));
			return res.sendFile(path.join(__dirname, 'client.html'));
		} else {
			
			res.statusCode = 500;
			log.error('Internal error(%d):%s', res.statusCode, err.message);
			return res.send({error: 'Server error'});
		}*/
	  //var express=require('express');
	  app.use(express.static(path.join(__dirname)));
	  res.sendFile(path.join(__dirname, 'client.html'));
	//});
		
	//}
	
});

app.use(express.static(path.join(__dirname, 'public')));

// Start Express http server on port 8080
//var webServer = http.createServer(app)
//webServer.listen(8080);
var expressServer  = app.listen(port)
// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(expressServer, {"log level":1});

easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});


// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

//launch ======================================================================
//app.listen(port);
console.log('The magic happens on port ' + port);

