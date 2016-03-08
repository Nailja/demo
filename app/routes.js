
// app/routes.js
//var users = require('./app/controllers/user.server.controller');

// load up the user model
var User            = require('../app/models/user');
var session = require('client-sessions');

module.exports = function(app, passport) {
		
	app.use(session({
		  cookieName: 'session',
		  secret: 'random_string_goes_here',
		  duration: 30 * 60 * 1000,
		  activeDuration: 5 * 60 * 1000,
		}));
	
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/MyAppLogin', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });	
	});

    
   /* app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/consent', // redirect to the secure profile section   /profile
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    })); */
    
    app.post('/login', function(req, res) {

    	 passport.authenticate('local-login', function(err, user) {
    	      if (!user) { return res.redirect('/login'); }
    	       //res.end('Authenticated!');
    	      console.log('authenticated / user: '+user);
    	      //req.session.user = user;
    	      
    	      req.user = user;
    	     
    	      res.redirect('/consent');
         })(req, res, function() {
        	 console.log('next ??');
        	 
         })
         
         /*if (req.session && req.session.user) { // Check if session exists
		    // lookup the user in the DB by pulling their email from the session
		    User.findOne({ email: req.session.user.email }, function (err, user) {
		      if (!user) {
		        // if the user isn't found in the DB, reset the session info and
		        // redirect the user to the login page
		        req.session.reset();
		        res.redirect('/login');
		      } else {
		        // expose the user to the template
		        res.locals.user = user;
		
		      }
		    });
		  } else {
		    res.redirect('/login');
		  }*/
    });
    	 
    	 /*
    	 
       // if (req.session && req.session.user) { // Check if session exists
            // lookup the user in the DB by pulling their email from the session
    	console.log('email: '+req.body.email);
            User.findOne(req.body.email, function (err, user) {
              if (!user) {
            	  console.log('err: '+err);
                // if the user isn't found in the DB, reset the session info and
                // redirect the user to the login page
                //req.session.reset();
                res.redirect('/login');
              } else {
                // expose the user to the template
            	  console.log('user: '+user);
            	  if (!user.verifyPassword(req.body.password)) {
            		  console.log('verifyPassword failed');
                      res.redirect('/login');
            	   } else {
             		  console.log('verifyPassword success');
                      //res.locals.user = user;
                      req.session.user = user;
                      // render the dashboard page
                      res.redirect('/profile');
            	   }
            	  };
              });

    	 
    });*/

    /*
 *     passport.authenticate('local', function(err, user) {
 *       if (!user) { return res.redirect('/login'); }
 *       res.end('Authenticated!');
 *     })(req, res);     */
    
    
    // process the login form
    /* app.post('/login', passport.authenticate('local-login', function (err, user) {
    	req.session.user = user;
    	if(!user) {
    		// redirect back to the signup page if there is an error
    		res.redirect('/login');
    	} else {
        	console.log('getting  email');
        	var User = require('./models/user');
        	User.find(req.params.email, function (err, user){
        		if (!user) {
        			res.statusCode = 404;
        			return res.send({error: 'Not found' });
        		}
        		if (!err) {
        			console.log('email'+ req.params.email);
        			// return res.send({statusCode : 200, user:req.params.email});
            		// redirect to the secure profile section
            		res.redirect('/profile');
        			
        		} else {
        			res.statusCode = 500;        			
        			return res.send({error: 'Server error'});
        		}
        	});
    	}    	
    }));  //(req, res)

   
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }) , function(req, res){
    	var User = require('./app/models/user');
        	console.log('get email');
        	return User.find(req.params.email, function (err, user){
        		if (!user) {
        			res.statusCode = 404;
        			return res.send({error: 'Not found' });
        		}
        		if (!err) {
        			console.log('email'+ req.params.email);
        			return res.send({statusCode : 200, user:req.params.email});
        			
        		} else {
        			res.statusCode = 500;        			
        			return res.send({error: 'Server error'});
        		}
        	}  );
    });*/

    //app.param('email',users.email);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/consent', // redirect to the secure profile section  /profile
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
    	console.log('in /profile');
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    	console.log('out /profile');
    });
    
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/consent', //  /profile
            failureRedirect : '/MyAppLogin'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/MyAppLogin');
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/MyAppLogin');
    });
    
 // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/consent',
                    failureRedirect : '/MyAppLogin'
            }));
    
    
    // =======================================
    //grab the user model
    /*
	var User = require('./models/user');
	console.log('user user.....');
	User.find({id :'56ceca0c3c8a4e301d900ea0'},function(err, user){
		if (err) throw err;
		
		//show the one user
		console.log('email' + this.email);
	});
	*/
};





// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	var util = require('util');
	console.log('is logged in: '+req.isAuthenticated());
	console.log(util.inspect(req, false, null));
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/MyAppLogin');
}
