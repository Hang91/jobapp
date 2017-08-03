var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var email 	= require('emailjs/email');

var db = mongojs('eventapp', ['users','events','types','subs']);

var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var ObjectId = require('mongodb').ObjectID;

var TypesModel = require('../models/TypeDB');
var EventsModel = require('../models/EventDB');

//login page - GET
router.get('/login', function(req, res){
	res.render('login', { title:'Login', user: req.user });
});




//login - POST


//register page - GET
router.get('/register', function(req, res){
	res.render('register', { title:'Sign up', user: req.user });
});

//add an event page - GET
router.get('/addEvent', ensureLoggedIn('login'), 
 function(req, res){
 	var collection = db.collection('types');
	collection.find({}).toArray(function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	console.log('find types '+results.length);
		res.render('addEvent', { title:'Add an Event', user: req.user, results:results});
	});
});

router.get('/addSub', ensureLoggedIn('login'),
function(req, res){
 	var collection = db.collection('types');
	collection.find({}).toArray(function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	console.log('find types '+results.length);
		res.render('addSub', { title:'Add an subscription', user: req.user, results:results});
	});
});


router.post('/addSub', function(req, res){
	//get form values
	var name 		= req.body.name;
	var type 		= req.body.type;
	var city    = req.body.city;
	var state 	= req.body.state;
	var country 	= req.body.country;
	var organization 	= req.body.organization;
	//var contact 	= req.body.contact;
	//var email 	= req.body.email;
	//var website 	= req.body.website;
	var region = req.body.region;
	var startDate 	= req.body.startDate;
	var endDate	= req.body.endDate;
	//var deadline = req.body.deadline;
	//var description	= req.body.description;
	if(typeof req.body.keywords == 'string') {
		var keywords	= req.body.keywords.split(",");
	} else {
		var keywords = null;
		console.log('keywords is not a string');
	}
	//var approved = 0;//0:not check yet; 1:approve; 2:disapprove\
	var userName = req.user.name;
	var userEmail = req.user.email;

	var newSub = {

		   name: name,
		   type: type,
		   region: region,
		   country: country,
		   state: state,
		   city: city,
		   organization: organization,
		   //contact: contact,
		   //email: email,
		   //website: website,
		   startDate: startDate,
		   endDate: endDate,
		   //deadline: deadline,
		   //description: description,
		   keywords: keywords,
		   //approved: approved,
		   userName: userName,
		   userEmail: userEmail
	}

	db.subs.insert(newSub, function(err, doc){
		if(err){
			res.send(err);
		}
		else{
			console.log('subscription added');
			//success msg

			req.flash('success', 'Successfully added an subscription!');
			res.location('/');
			res.redirect('/');
		}
	});
});

//add an event page - POST
router.post('/addEvent', function(req, res){
	//get form values
	var name 		= req.body.name;
	var type 		= req.body.type;
	var city    = req.body.city;
	var state 	= req.body.state;
	var country 	= req.body.country;
	var region		= req.body.region;
	var organization 	= req.body.organization;
	var contact 	= req.body.contact;
	var email 	= req.body.email;
	var website 	= req.body.website;
	var startDate 	= req.body.startDate;
	var endDate	= req.body.endDate;
	var deadline = req.body.deadline;
	var description	= req.body.description;
	if(typeof req.body.keywords == 'string') {
		var keywords	= req.body.keywords.split(",");
	} else {
		var keywords = null;
		console.log('keywords is not a string');
	}
	var approved = 0;//0:not check yet; 1:approve; 2:disapprove\
	var userName = req.user.name;
	var userEmail = req.user.email;



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
		   region: region,//continent
		   country: country,
		   state: state,
		   city: city,
		   organization: organization,
		   contact: contact,
		   email: email,
		   website: website,
		   startDate: startDate,
		   endDate: endDate,
		   deadline: deadline,
		   description: description,
		   keywords: keywords,
		   approved: approved,
		   userName: userName,
		   userEmail: userEmail
	}

		// bcrypt.genSalt(10, function(err, salt){
		// 	bcrypt.hash(newUser.password, salt, function(err, hash){
		// 		newUser.password = hash;
				// Push To Array

			//add to event
	EventsModel.create(newEvent, function(err, doc){
	if(err){
		res.send(err);
	}
	else{
		console.log('Event added');
		//success msg
		alertUser(newEvent);
		req.flash('success', 'Successfully added an event!');
		res.location('/');
		res.redirect('/');
	}
	});

				/* add to user
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
				});*/
				
		// 	});
		// });		
	// }	
});

function alertUser(newEvent) {
	var collection = db.collection('subs');
	var name = newEvent.name;
	var type = newEvent.type;
	var keywords = newEvent.keywords;
	var region = newEvent.region;
	var country = newEvent.country;
	var state = newEvent.state;
	var city = newEvent.city;
	var startDate = newEvent.startDate;
	var endDate = newEvent.endDate;

	//delete out-of-date subs
	// var today = new Date();
	// var dd = today.getDate();
	// var mm = today.getMonth()+1; //January is 0!
	// var yyyy = today.getFullYear();

	// if(dd<10) {
	//     dd = '0'+dd
	// } 

	// if(mm<10) {
	//     mm = '0'+mm
	// } 

	// today =  yyyy + '-' + mm + '-' + dd;
	// console.log(today);
	// collection.remove({'startDate': {$lt:today}})

	if(!name) {
		var nameStr = {};
	}
	else {
		nameStr = {$or: [{'name': name}, {'name': ""}]};
	}
	if(!type){
		var typeStr = {};
	}
	else{
		var typeStr = {$or: [{'type': type}, {'type': ""}]};
	}
	if(keywords.length == 1 && !keywords[0]){
		var keywordsStr = {};
	}
	else{
		var keywordsStr = {$or: [{'keywords': {$in:keywords}}, {'keywords' : ""} ]};//or
		//var keywordsStr = {'keywords': {$all:keywords}};//and
	}
	if(!region){
		var regionStr = {};
	}
	else{
		var regionStr = {$or: [{'region' : region}, {'region': ""}, {'region': null}]};
	}		
	if(!country){
		var countryStr = {};
	}
	else{
		var countryStr = {$or: [{'country' : country}, {'country': ""}, {'country': null}]};
	}
	if(!state){
		var stateStr = {};
	}
	else{
		var stateStr = {$or: [{'state' : state}, {'state': ""}, {'state': null}]};
	}
	if(!city){
		var cityStr = {};
	}
	else{
		var cityStr = {$or: [{'city' : city}, {'city': ""}]};
	}
	if(!startDate){
		var startDateStr = {};
	}
	else{
		var startDateStr = {$or: [{'startDate': {$lte:startDate}}, {'startDate': ""}]};
	}
	if(!endDate){
		var endDateStr = {};
	}
	else{
		var endDateStr = {$or: [{'endDate' : {$gte:endDate}}, {'endDate': ""}]};
	}
	collection.find({$and: [nameStr, typeStr, regionStr, countryStr, stateStr, cityStr, startDateStr, endDateStr, keywordsStr]}).toArray(function(err, results){
		console.log('user number' + results.length);
		for(var i = 0; i < results.length; i++){
			console.log('userEmail: ' + results[i].userEmail);
			var server 	= email.server.connect({
			   user:    "jinhang91@hotmail.com", 
			   password:"891110Hotmail", 
			   host:	"smtp-mail.outlook.com", 
			   tls: {ciphers: "SSLv3"}
			});

			var message	= {
			   text:	"Hello " + results[i].userName + ", \n There is a new event match your subscription. Below is the detailed information. \n" + 
			   "Event name: " + name + "\n" + "Event type: " + type + "\n",
			   from:	"you <jinhang91@hotmail.com>", 
			   to:		"zhuyingcau <" + results[i].userEmail + ">",
			   cc:		"",
			   subject:	"testing email js"
			   /*
			   attachment: 
			   [
			      {data:"<html>i <i>hope</i> this works!</html>", alternative:true},
			      {path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
			   ]
			   */
			};

			// send the message and get a callback with an error or details of the message that was sent
			server.send(message, function(err, message) { 
					console.log(err || message); 
			});
		}

	});
}


//register - POST
router.post('/register', 
	// passport.authenticate('local-register', {
 //                                   failureRedirect: '/users/register',
 //                                   failureFlash: true }), 
	function(req, res){
	//get form values
	var name 		= req.body.name;
	var email 		= req.body.email;
	// var username    = req.body.username;
	var password 	= req.body.password;
	var password2 	= req.body.password2;
	//var events 		= []

	//validation
	req.checkBody('name', 'Name fieled is required').notEmpty();
	req.checkBody('email', 'Email fieled is required').notEmpty();
	req.checkBody('email', 'Please use a valid email address').isEmail();
	// req.checkBody('username', 'Username fieled is required').notEmpty();
	req.checkBody('password', 'password filed is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	//check for errors
	var errors = req.validationErrors();
	if(errors){
		console.log('form has errors');
		req.flash('error', 'Passwords do not match.');
		res.render('register', {
			errors: errors,
			title:'Sign up',
			name: name,
			email: email,
			// username: username,
			password: password,
			password2: password2,
			user: req.user

		});
	}
	else{

		db.users.findOne({'email': email}, function(err, user){
			if(err){
				res.send(err);
			}
			if(user){				
				console.log('Exist User');
				//error msg
				req.flash('error', 'This email has been used.');
				//res.location('/users/register');
				//res.redirect('/users/register');
				res.render('register', {
					errors: errors,
					title:'Sign up',
					name: name,
					email: email,
					// username: username,
					password: password,
					password2: password2,
					user: req.user
				});
			}
			if(!user){
				var newUser = {
					name: name,
					email: email,
					// username: username,
					password: password
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
								res.location('/users/login');
								res.redirect('/users/login');
							}
						});
					});
				});
			}
		});
	}	

		// var newUser = {
		// 	name: name,
		// 	email: email,
		// 	// username: username,
		// 	password: password,
		// 	//events: events
		// }

		// bcrypt.genSalt(10, function(err, salt){
		// 	bcrypt.hash(newUser.password, salt, function(err, hash){
		// 		newUser.password = hash;

		// 		db.users.insert(newUser, function(err, doc){
		// 		if(err){
		// 			res.send(err);
		// 		}
		// 		else{
		// 			console.log('User added');
		// 			//success msg
		// 			req.flash('success', 'You have registered! You can login now!');
		// 			res.location('/');
		// 			res.redirect('/');
		// 		}
		// 		});
		// 	});
		// });

			
});

passport.serializeUser(function(user, done) {
  	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  	db.users.findOne({_id:mongojs.ObjectId(id)}, function(err,user){
		done(err, user);
  	});
});


// passport.use('local-register', new LocalStrategy({
//     usernameField : 'email',
//     passReqToCallback : true
// 	},
// 	function(req, email, done){
// 	db.users.findOne({'email': email}, function(err, user){
// 		if(err){
// 			return done(err);
// 		}
// 		if(user){
// 			return done(null, false, req.flash('error', 'This email has been used.'));
// 		}
// 	});
// }
// ));

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
	},
	function(req, email, password, done){
		
		db.users.findOne({'email': email}, function(err, user){
		if(err){
			return done(err);
		}
		if(!user){
			return done(null, false, req.flash('error', 'User not found.'));
		}

		bcrypt.compare(password, user.password, function(err, isMatch){
			if(err){
				return done(err);
			}
			if(isMatch){
				return done(null,user, req.flash('success','Login successfully.'));
			}
			else{
				return done(null, false, req.flash('error','Password incorrect.'));
			}
		});
	});
}
));



//login - POST
router.post('/login',
  passport.authenticate('local-login', { successFlash: true,
  									successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: true }), 
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

router.get('/mySub', ensureLoggedIn('login'), 
 function(req, res){
 	var collection = db.collection('subs');
	collection.find({userEmail: req.user.email}).toArray(function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	//console.log('number of subcriptions: '+results.length);
		res.render('mySub',{title:'My subcriptions',results:results});
	}); 	
});

router.get('/myEvent', ensureLoggedIn('login'), 
 function(req, res){
 	var collection = db.collection('events');
	collection.find({userEmail: req.user.email}).toArray(function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	console.log('number of events: '+results.length);
		res.render('myEvent',{title:'My events',results:results});
	}); 	
});

router.get('/myProfile', ensureLoggedIn('login'),
	function(req, res){
		var collection = db.collection('users');
		collection.find({email: req.user.email}).toArray(function(err, results){
			if(err){
				console.log(err);
			}
			res.render('myProfile', {title: 'My profile', results: results});
		});
	}
);

router.get('/editSub', ensureLoggedIn('login'), function(req, res){
	console.log('in get editSub');
	var types;
	db.types.find({}).toArray(function(err, typeresults){
		if (err) {
    		console.dir( err );
    	}
    	console.log('find types '+typeresults.length);
    	types = typeresults;
    	db.subs.find({_id: ObjectId(req.query.id)}).toArray(function(err, results){
			if(err) {
				console.dir(err);
			}
		// console.log('find subscription ' + results.length);
		// console.log('results.name: ' + results[0].name);
		//console.log('find types '+types.length);
			res.render('editSub', { title:'Edit subscription', user: req.user, types: types, sub: results});
		});
	});
	
});

router.get('/editEvent', ensureLoggedIn('login'), function(req, res){
	console.log('in get editEvent');
	var types;
	db.types.find({}).toArray(function(err, typeresults){
		if (err) {
    		console.dir( err );
    	}
    	//console.log('find types '+typeresults.length);
    	types = typeresults;
    	db.events.find({_id: ObjectId(req.query.id)}).toArray(function(err, results){
			if(err) {
				console.dir(err);
			}
		// console.log('find subscription ' + results.length);
		// console.log('results.name: ' + results[0].name);
		//console.log('find types '+types.length);
			res.render('editEvent', { title:'Edit event', user: req.user, types: types, event: results});
		});
	});
	
});

router.get('/editProfile', ensureLoggedIn('login'), function(req, res){
	console.log('in editProfile');

	db.users.find({_id: ObjectId(req.query.id)}).toArray(function(err, results){
		if(err) {
			console.dir(err);
		}
	// console.log('find subscription ' + results.length);
	// console.log('results.name: ' + results[0].name);
	//console.log('find types '+types.length);
		console.log(results);
		res.render('editProfile', { title:'Edit profile', user: req.user, results: results});
	});	
});

router.post('/editSub', ensureLoggedIn('login'), function(req, res){
	//get form values
	var name 		= req.body.name;
	var type 		= req.body.type;
	var city    = req.body.city;
	var state 	= req.body.state;
	var country 	= req.body.country;
	var region 	= req.body.region;
	var organization 	= req.body.organization;
	//var contact 	= req.body.contact;
	//var email 	= req.body.email;
	//var website 	= req.body.website;
	var startDate 	= req.body.startDate;
	var endDate	= req.body.endDate;
	//var deadline = req.body.deadline;
	//var description	= req.body.description;
	if(typeof req.body.keywords == 'string') {
		var keywords	= req.body.keywords.split(",");
	} else {
		var keywords = null;
		console.log('keywords is not a string');
	}
	//var approved = 0;//0:not check yet; 1:approve; 2:disapprove\
	var userName = req.user.name;
	var userEmail = req.user.email;
	var id = req.body.id;
	var newSub = {
		   name: name,
		   type: type,
		   city: city,
		   state: state,
		   country: country,
		   region: region,
		   organization: organization,
		   //contact: contact,
		   //email: email,
		   //website: website,
		   startDate: startDate,
		   endDate: endDate,
		   //deadline: deadline,
		   //description: description,
		   keywords: keywords,
		   //approved: approved,
		   userName: userName,
		   userEmail: userEmail
	}
	console.log('id = '+id);
	db.subs.update({_id:ObjectId(id)}, newSub, function(err, doc){
		if(err){
			res.send(err);
		}
		else{
			console.log('subscription updated');
			//success msg

			req.flash('success', 'Successfully edited a subscription!');
			db.subs.find({userEmail: req.user.email}).toArray(function(err, results){
				if (err) {
		    		console.dir( err );
		    	}
		    	//console.log('number of subcriptions: '+results.length);
				res.render('mySub',{title:'My subcriptions', user:req.user, results:results});
			}); 
		}
	});
});

router.post('/editEvent', ensureLoggedIn('login'), function(req, res){
	//get form values
	var name 		= req.body.name;
	var type 		= req.body.type;
	var city    = req.body.city;
	var state 	= req.body.state;
	var country 	= req.body.country;
	var region 	= req.body.region;
	var organization 	= req.body.organization;
	var contact 	= req.body.contact;
	var email 	= req.body.email;
	var website 	= req.body.website;
	var startDate 	= req.body.startDate;
	var endDate	= req.body.endDate;
	var deadline = req.body.deadline;
	var description	= req.body.description;
	if(typeof req.body.keywords == 'string') {
		var keywords	= req.body.keywords.split(",");
	} else {
		var keywords = null;
		console.log('keywords is not a string');
	}
	var approved = 0;//0:not check yet; 1:approve; 2:disapprove\
	var userName = req.user.name;
	var userEmail = req.user.email;
	var id = req.body.id;
	var newEvent = {
		   name: name,
		   type: type,
		   city: city,
		   state: state,
		   country: country,
		   region: region,
		   organization: organization,
		   contact: contact,
		   email: email,
			website: website,
		   startDate: startDate,
		   endDate: endDate,
		   deadline: deadline,
		   description: description,
		   keywords: keywords,
		   approved: approved,
		   userName: userName,
		   userEmail: userEmail
	}
	console.log('id = '+id);
	db.events.update({_id:ObjectId(id)}, newEvent, function(err, doc){
		if(err){
			res.send(err);
		}
		else{
			console.log('event updated');
			//success msg

			req.flash('success', 'Successfully edited an event!');
			db.events.find({userEmail: req.user.email}).toArray(function(err, results){
				if (err) {
		    		console.dir( err );
		    	}
		    	//console.log('number of subcriptions: '+results.length);
				res.render('myEvent',{title:'My events', user:req.user, results:results});
			}); 
		}
	});
});


router.post('/editProfile', ensureLoggedIn('login'), function(req, res){
	//get form values
	var name 		= req.body.name;
	// var type 		= req.body.type;
	// var city    = req.body.city;
	// var state 	= req.body.state;
	// var country 	= req.body.country;
	// var region 	= req.body.region;
	// var organization 	= req.body.organization;
	// var contact 	= req.body.contact;
	// var email 	= req.body.email;
	// var website 	= req.body.website;
	// var startDate 	= req.body.startDate;
	// var endDate	= req.body.endDate;
	// var deadline = req.body.deadline;
	// var description	= req.body.description;
	// if(typeof req.body.keywords == 'string') {
	// 	var keywords	= req.body.keywords.split(",");
	// } else {
	// 	var keywords = null;
	// 	console.log('keywords is not a string');
	// }
	// var approved = 0;//0:not check yet; 1:approve; 2:disapprove\
	// var userName = req.user.name;
	// var userEmail = req.user.email;
	// var id = req.body.id;
	// var newEvent = {
	// 	   name: name,
	// 	   type: type,
	// 	   city: city,
	// 	   state: state,
	// 	   country: country,
	// 	   region: region,
	// 	   organization: organization,
	// 	   contact: contact,
	// 	   email: email,
	// 		website: website,
	// 	   startDate: startDate,
	// 	   endDate: endDate,
	// 	   deadline: deadline,
	// 	   description: description,
	// 	   keywords: keywords,
	// 	   approved: approved,
	// 	   userName: userName,
	// 	   userEmail: userEmail
	// }
	console.log('id = '+id);
	db.events.update({_id:ObjectId(id)}, {$set: {'name':name}}, function(err, doc){
		if(err){
			res.send(err);
		}
		else{
			console.log('profile updated');
			//success msg

			req.flash('success', 'Successfully edited your profile!');
			db.users.find({_id: ObjectId(req.query.id)}).toArray(function(err, results){
				if(err) {
					console.dir(err);
				}
			// console.log('find subscription ' + results.length);
			// console.log('results.name: ' + results[0].name);
			//console.log('find types '+types.length);
				res.render('editProfile', { title:'Edit profile', user: req.user, results: results});
			});	
		}
	});
});

router.post('/editPw', ensureLoggedIn('login'), 
	function(req, res){
		//get form values
		var id 					= req.body.id;
		var origin_password 	= req.body.origin_password;
		var new_password 		= req.body.new_password;
		var new_password2		= req.body.new_password2;

		function(req, email, password, done){
		
			db.users.findOne({_id: ObjectId(req.query.id)}, function(err, user){
			if(err){
				return done(err);
			}
			if(!user){
				return done(null, false, req.flash('error', 'User not found.'));
			}

			bcrypt.compare(origin_password, user.password, function(err, isMatch){
				if(err){
					return done(err);
				}
				if(isMatch){
					
					return done(null,user);
				}
				else{
					return done(null, false, req.flash('error','Password incorrect.'));
				}
			});
		});

		console.log('id = '+id);
		db.events.update({_id:ObjectId(id)}, {$set: {'name':name}}, function(err, doc){
			if(err){
				res.send(err);
			}
			else{
				console.log('profile updated');
				//success msg

				req.flash('success', 'Successfully edited your profile!');
				db.users.find({_id: ObjectId(req.query.id)}).toArray(function(err, results){
					if(err) {
						console.dir(err);
					}
				// console.log('find subscription ' + results.length);
				// console.log('results.name: ' + results[0].name);
				//console.log('find types '+types.length);
					res.render('editProfile', { title:'Edit profile', user: req.user, results: results});
				});	
			}
		});
	},

);

router.get('/deleteSub', ensureLoggedIn('login'), function(req, res){
	var collection = db.collection('subs');
	db.subs.remove({_id: ObjectId(req.query.id)});
	collection.find({userEmail: req.user.email}).toArray(function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	console.log('number of subcriptions: '+results.length);
		res.render('mySub',{title:'My subcriptions',results:results});
	}); 	
});

router.get('/deleteEvent', ensureLoggedIn('login'), function(req, res){
	var collection = db.collection('events');
	db.events.remove({_id: ObjectId(req.query.id)});
	collection.find({userEmail: req.user.email}).toArray(function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	console.log('number of events: '+results.length);
		res.render('myEvent',{title:'My events',results:results});
	}); 	
});

module.exports = router;


























