var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('eventapp', ['users']);
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


//login page - GET
router.get('/login', function(req, res){
	res.render('login');
});

//login - POST


//register page - GET
router.get('/register', function(req, res){
	res.render('register');
});

//add an event page - GET
router.get('/addEvent', ensureLoggedIn('login'), 
 function(req, res){
    res.render('addEvent', { user: req.user });
 //res.render('addEvent');
});

//add an event page - POST
router.post('/addEvent', function(req, res){
	//get form values
	var name 		= req.body.name;
	var type 		= req.body.type;
	var city    = req.body.city;
	var state 	= req.body.state;
	var country 	= req.body.country;
	var organization 	= req.body.organization;
	var contact 	= req.body.contact;
	var email 	= req.body.email;
	var website 	= req.body.website;
	var startDate 	= req.body.startDate;
	var endDate	= req.body.endDate;

	var description	= req.body.description;
	var keywords	= req.body.keywords;
	var approved = 0;//0:not check yet; 1:approve; 2:disapprove



	//validation
	// req.checkBody('name', 'Name fieled is required').notEmpty();
	// req.checkBody('email', 'Email fieled is required').notEmpty();
	// req.checkBody('email', 'Please use a valid email address').isEmail();
	// req.checkBody('username', 'Username fieled is required').notEmpty();
	// req.checkBody('password', 'password filed is required').notEmpty();
	// req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	//check for errors
	// var errors = req.validationErrors();
	// if(errors){
	// 	console.log('form has errors');
	// 	res.render('register', {
	// 		errors: errors,
	// 		name: name,
	// 		email: email,
	// 		username: username,
	// 		password: password,
	// 		password2: password2
	// 	});
	// }
	// else{
		var newEvent = {
			   name: name,
			   type: type,
			   city: city,
			   state: state,
			   country: country,
			   organization: organization,
			   contact: contact,
			   email: email,
			   website: website,
			   startDate: startDate,
			   endDate: endDate,
			   description: description,
			   keywords: keywords,
			   approved: approved
		}

		// bcrypt.genSalt(10, function(err, salt){
		// 	bcrypt.hash(newUser.password, salt, function(err, hash){
		// 		newUser.password = hash;
				// Push To Array
				console.log(req.body.useremail);
				db.users.update({email:req.user.email},{
				  $push: {
				    events:newEvent
				  }
				}, function(err, doc){
				if(err){
					res.send(err);
				}
				else{
					console.log('new Event added');
					//success msg
					req.flash('success', 'You have added a new event!');

					res.location('/');
					res.redirect('/');
				}
				});
				
		// 	});
		// });		
	// }	
});


//register - POST
router.post('/register', function(req, res){
	//get form values
	var name 		= req.body.name;
	var email 		= req.body.email;
	var username    = req.body.username;
	var password 	= req.body.password;
	var password2 	= req.body.password2;
	//var events 		= []

	//validation
	req.checkBody('name', 'Name fieled is required').notEmpty();
	req.checkBody('email', 'Email fieled is required').notEmpty();
	req.checkBody('email', 'Please use a valid email address').isEmail();
	req.checkBody('username', 'Username fieled is required').notEmpty();
	req.checkBody('password', 'password filed is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	//check for errors
	var errors = req.validationErrors();
	if(errors){
		console.log('form has errors');
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	}
	else{

		var newUser = {
			name: name,
			email: email,
			username: username,
			password: password,
			//events: events
		}

		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(newUser.password, salt, function(err, hash){
				newUser.password = hash;

				db.users.insert(newUser, function(err, doc){
				if(err){
					res.send(err);
				}
				else{
					console.log('User added');
					//success msg
					req.flash('success', 'You have registered! You can login now!');
					res.location('/');
					res.redirect('/');
				}
				});
			});
		});

		
	}

	
});

passport.serializeUser(function(user, done) {
  	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  	db.users.findOne({_id:mongojs.ObjectId(id)}, function(err,user){
		done(err, user);
  	});
});


passport.use(new LocalStrategy(
	function(username, password, done){
	db.users.findOne({username: username}, function(err, user){
		if(err){
			return done(err);
		}
		if(!user){
			return done(null, false, {message:'Incorrect Username'});
		}

		bcrypt.compare(password, user.password, function(err, isMatch){
			if(err){
				return done(err);
			}
			if(isMatch){
				return done(null,user);
			}
			else{
				return done(null, false, {message: 'Incorrect Password'});
			}
		});
	});
}
));

//login - POST
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: 'Invalid Username or Password' }), 
  function(req, res){
  	console.log('Auth Successful');
  	res.redirect('/');
  }
);
// var api = require('../lib/api');

// router.post('/login', function(req, res, next) {
// 	var user = {
// 		username : req.body.username,
// 		password: req.body.password
// 	};
// 	api.findOne(user)
// 		.then(result => {
// 			console.log(result)
// 		});
// 	res.redirect('/');
// })


router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
});

module.exports = router;


























