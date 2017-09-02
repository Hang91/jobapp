var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var email 	= require('emailjs/email');

var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var ObjectId = require('mongodb').ObjectID;

//var TypesModel = require('../models/TypeDB');
var JobsModel = require('../models/JobDB');
var employmentTypesModel = require('../models/EmploymentTypeDB');
var JobSubsModel = require('../models/JobSubDB');
var UsersModel = require('../models/UserDB');
var AlertModel = require('../models/AlertDB');
//login page - GET
router.get('/login', function(req, res){
	res.render('login', { title:'Login', user: req.user });
});




//login - POST


//register page - GET
router.get('/register', function(req, res){
	res.render('register', { title:'Sign up', user: req.user });
});

//add an job page - GET
router.get('/addJob', ensureLoggedIn('login'), 
 function(req, res){
	employmentTypesModel.find({}, function(err, types){
		if (err) {
    		console.dir( err );
    	}
    	console.log('employmentTypes.length: ' + types.length);

		res.render('addJob', { title:'Add a job', user: req.user, employmentTypes: types});
	});
});

router.get('/addSub', ensureLoggedIn('login'),
function(req, res){
	employmentTypesModel.find({}, function(err, types){
		if (err) {
    		console.dir( err );
    	}
    	console.log('types number:' + types.length);
		res.render('addSub', { title:'Add an subscription', user: req.user, employmentTypes: types});
	});
});


router.post('/addSub', function(req, res){
	//get form values
	var name = req.body.name;
	var positionType = req.body.positionType;
	var employmentType		= req.body.employmentType;
	var field 	= req.body.field;
	var city    = req.body.city;
	var state 	= req.body.state;
	var country 	= req.body.country;
	var institution 	= req.body.institution;
	//var contact 	= req.body.contact;
	//var email 	= req.body.email;
	//var website 	= req.body.website;
	var region = req.body.region;
	// var startDate 	= req.body.startDate;
	// var endDate	= req.body.endDate;
	var deadline = req.body.deadline;
	//var description	= req.body.description;
	var salary = req.body.salary;
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
		   	positionType: positionType,
		   	employmentType: employmentType,
		   	field: field,
		   	region: region,
		   	country: country,
		   	state: state,
		   city: city,
		   institution: institution,
		   salary: salary,
		   deadline: deadline,
		   //contact: contact,
		   //email: email,
		   //website: website,
		   // startDate: startDate,
		   // endDate: endDate,
		   //description: description,
		   keywords: keywords,
		   //approved: approved,
		   userName: userName,
		   userEmail: userEmail
	}

	JobSubsModel.create(newSub, function(err, doc){
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
router.post('/addJob', function(req, res){
	//get form values
	var name 		= req.body.name;
	var positionType 		= req.body.positionType;
	var employmentType = req.body.employmentType;
	var field = req.body.field;
	var city    = req.body.city;
	var state 	= req.body.state;
	var country 	= req.body.country;
	var region		= req.body.region;
	var institution 	= req.body.institution;
	var contact 	= req.body.contact;
	var email 	= req.body.email;
	var website 	= req.body.website;
	var deadline = req.body.deadline;
	var description	= req.body.description;
	var salary = req.body.salary;
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
	var newJob = {
		   name: name,
		   positionType: positionType,
		   employmentType: employmentType,
		   field: field,
		   region: region,//continent
		   country: country,
		   state: state,
		   city: city,
		   institution: institution,
		   contact: contact,
		   email: email,
		   website: website,
		   deadline: deadline,
		   salary: salary,
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
	JobsModel.create(newJob, function(err, doc){
		if(err){
			res.send(err);
		}
		else{
			console.log('Job added');
			//success msg
			// alertUser(newEvent);
			req.flash('success', 'Successfully added a job!');
			res.location('/');
			res.redirect('/');
		}
	});	
});

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

		UsersModel.findOne({'email': email}, function(err, user){
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
					password: password,
					//events: events
					priority: 0
				}

				bcrypt.genSalt(10, function(err, salt){
					bcrypt.hash(newUser.password, salt, function(err, hash){
						newUser.password = hash;
						UsersModel.create(newUser, function(err, doc){
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
  	UsersModel.findOne({_id:mongojs.ObjectId(id)}, function(err,user){
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
		
		UsersModel.findOne({'email': email}, function(err, user){
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
	JobSubsModel.find({userEmail: req.user.email}, function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	//console.log('number of subcriptions: '+results.length);
		res.render('mySub',{title:'My subcriptions', user: req.user, results:results});
	}); 	
});


router.get('/myJob', ensureLoggedIn('login'), 
 function(req, res){
 	var limit = 5;
    var currentPage1 = 1;
    var currentPage2 = 1;
    var currentPage3 = 1;
    var tab = req.query.tab;
    if(req.query.currentPage1){
        currentPage1 = req.query.currentPage1;
    }
    if(req.query.currentPage2){
        currentPage2 = req.query.currentPage2;
    }
    if(req.query.currentPage3){
        currentPage3 = req.query.currentPage3;
    }
    if (currentPage1 < 1) {
        currentPage1 = 1;
    }
    if (currentPage2 < 1) {
        currentPage2 = 1;
    }
    if (currentPage3 < 1) {
        currentPage3 = 1;
    }
 	JobsModel.find({userEmail: req.user.email, approved : 0},function(err1, results1){//to be approve
        if(err1){
            return next(err1);
        }
        var totallength1 = results1.length;
        var totalPage1 = Math.floor(totallength1 / limit);
        
        if (totallength1 % limit != 0) {
            totalPage1 += 1;
        }
        if (totalPage1 != 0 && currentPage1 > totalPage1) {
            currentPage1 = totalPage1;
        }
        JobsModel.find({userEmail: req.user.email, approved : 0}).skip((currentPage1 - 1) * limit).limit(limit).sort('deadline').sort('city').sort('country').exec(function(err11, results11) {
        //console.log(results11.length);
                if(err11){
                    return next(err11);
                }
                JobsModel.find({userEmail: req.user.email, approved : 1},function(err2, results2){//approve
                if(err2){
                    return next(err2);
                }
                var totallength2 = results2.length;
                var totalPage2 = Math.floor(totallength2 / limit);
                
                if (totallength2 % limit != 0) {
                    totalPage2 += 1;
                }
                if (totalPage2 != 0 && currentPage2 > totalPage2) {
                    currentPage2 = totalPage2;
                }
                //console.log(results2.length);
                JobsModel.find({userEmail: req.user.email, approved : 1}).skip((currentPage2 - 1) * limit).limit(limit).sort('deadline').sort('city').sort('country').exec(function(err22, results22) {
                    if(err22){
                        return next(err22);
                    }
                    JobsModel.find({userEmail: req.user.email, approved : 3},function(err3, results3){//revise
                        if(err3){
                            return next(err3);
                        }
                        var totallength3 = results3.length;
                        var totalPage3 = Math.floor(totallength3 / limit);
                        
                        if (totallength3 % limit != 0) {
                            totalPage3 += 1;
                        }
                        if (totalPage3 != 0 && currentPage3 > totalPage3) {
                            currentPage3 = totalPage3;
                        }
                        JobsModel.find({userEmail: req.user.email, approved : 3}).skip((currentPage3 - 1) * limit).limit(limit).sort('deadline').sort('city').sort('country').exec(function(err33, results33) {
                            res.render('myJob', { title:'My Jobs', user:req.user, 
                                results1 : results11, results2 : results22, results3 : results33,
                                totalPage1:totalPage1, totalPage2:totalPage2, totalPage3:totalPage3,
                                currentPage1:currentPage1,currentPage2:currentPage2,currentPage3:currentPage3, 
                                totallength1:totallength1,totallength2:totallength2,totallength3:totallength3});                            
                        });
                    }); 
                });
            }); 
        });
    }); 	
});



router.get('/myProfile', ensureLoggedIn('login'),
	function(req, res){
		UsersModel.findOne({email: req.user.email}, function(err, results){
			if(err){
				console.log(err);
			}
			console.log('length: ' + results.length);
			res.render('myProfile', {title: 'My profile', user: req.user, results: results});
		});
	}
);

router.get('/editSub', ensureLoggedIn('login'), function(req, res){
	console.log('in get editSub');
	var types;
	employmentTypesModel.find({}, function(err, employmentTypesResult){
		if (err) {
    		console.dir( err );
    	}
    	console.log('find types '+employmentTypesResult.length);
    	employmentTypesResult = employmentTypesResult;
    	JobSubsModel.findById(req.query.id, function(err, results){
			if(err) {
				console.dir(err);
			}
			res.render('editSub', { title:'Edit subscription', user: req.user, employmentTypesResult: employmentTypesResult, results: results});
		});
	});
	
});

router.get('/editJob', ensureLoggedIn('login'), function(req, res){
	console.log('in get editEvent');
	var id = req.query.id;
    //console.log(id);
    employmentTypesModel.find({}, function(err, employmentTypes){
        if(err){
            return next(err);
        }
        JobsModel.findById(id, function(err, job){
            if(err){
                res.send(err);
            }
            res.render('editJob', {title: 'Edit Job', 
                user: req.user, employmentTypes: employmentTypes, job:job});
        });
    });	
});

router.get('/editProfile', ensureLoggedIn('login'), function(req, res){
	console.log('in editProfile');

	UsersModel.findById(req.query.id, function(err, results){
		if(err) {
			console.dir(err);
		}
	// console.log('find subscription ' + results.length);
	// console.log('results.name: ' + results[0].name);
	//console.log('find types '+types.length);
		//console.log(results);
		res.render('editProfile', { title:'Edit profile', user: req.user, results: results});
	});	
});

router.get('/editPassword', ensureLoggedIn('login'), function(req, res){
	//console.log('in editPassword');

	UsersModel.findById(req.query.id, function(err, results){
		if(err) {
			console.dir(err);
		}
	// console.log('find subscription ' + results.length);
	// console.log('results.name: ' + results[0].name);
	//console.log('find types '+types.length);
		//console.log(results);
		res.render('editPassword', { title:'Edit password', user: req.user, results: results});
	});	
});




router.post('/editSub', ensureLoggedIn('login'), function(req, res){
	//get form values
	var name 		= req.body.name;
	var employmentType 		= req.body.employmentType;
	var positionType 		= req.body.positionType;
	var city    = req.body.city;
	var state 	= req.body.state;
	var country 	= req.body.country;
	var region 	= req.body.region;
	var institution 	= req.body.institution;
	var deadline = req.body.deadline;
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
		   employmentType: employmentType,
		   positionType: positionType,
		   city: city,
		   state: state,
		   country: country,
		   region: region,
		   institution: institution,
		   deadline: deadline,
		   keywords: keywords,
		   userName: userName,
		   userEmail: userEmail
	}
	console.log('id = '+id);
	JobSubsModel.update({_id:ObjectId(id)}, newSub, function(err, doc){
		if(err){
			res.send(err);
		}
		else{
			console.log('subscription updated');
			//success msg

			req.flash('success', 'Successfully edited a subscription!');
			JobSubsModel.find({userEmail: req.user.email}, function(err, results){
				if (err) {
		    		console.dir( err );
		    	}
		    	//console.log('number of subcriptions: '+results.length);
				res.render('mySub',{title:'My subcriptions', user:req.user, results:results});
			}); 
		}
	});
});

router.post('/editJob', ensureLoggedIn('login'), function(req, res){
    //get form values
    var id        = req.body.id;
    var name        = req.body.name;
    var positionType		= req.body.positionType;
    var employmentType        = req.body.employmentType;
    var field 	= req.body.field;
    var city    = req.body.city;
    var state   = req.body.state;
    var country     = req.body.country;
    var region      = req.body.region;
    var institution    = req.body.institution;
    var contact     = req.body.contact;
    var email   = req.body.email;
    var website     = req.body.website;
    var deadline = req.body.deadline;
    var salary = req.body.salary;
    var description = req.body.description;
    if(typeof req.body.keywords == 'string') {
        var keywords    = req.body.keywords.split(",");
    } else {
        var keywords = null;
        console.log('keywords is not a string');
    }
    var userName = req.user.name;
    var userEmail = req.user.email;
    var newJob = {
               name: name,
               positionType: positionType,
               employmentType: employmentType,
               field: field,
               region: region,//continent
               country: country,
               state: state,
               city: city,
               institution: institution,
               contact: contact,
               email: email,
               website: website,
               deadline: deadline,
               description: description,
               keywords: keywords,
               salary: salary,
               userName: userName,
               userEmail: userEmail
        }
    //update
    JobsModel.update({_id:ObjectId(id)}, {$set: newJob}, function(err, doc){
    if(err){
        res.send(err);
    }
    else{
        console.log('Successfully edited!');
        //success msg
        //alertUser(newEvent);
        req.flash('success', 'Successfully edited!');
        res.location('/users/myJob');
        res.redirect('/users/myJob');
    }
    });
});


router.post('/editProfile', ensureLoggedIn('login'), function(req, res){
	//get form values
	var name 		= req.body.name;
	var id = req.body.id;
	UsersModel.update({_id:ObjectId(id)}, {$set: {'name':name}}, function(err, doc){
		if(err){
			res.send(err);
		}
		else{
			console.log('profile updated');
			//success msg

			req.flash('success', 'Successfully edited your profile!');
			UsersModel.findById(id, function(err, results){
				if(err) {
					console.dir(err);
				}
				res.render('myProfile', { title:'My profile', user: req.user, results: results});
			});	
		}
	});
});

router.post('/editPassword', ensureLoggedIn('login'), 
	function(req, res){
		//get form values
		var id 					= req.body.id;
		var origin_password 	= req.body.origin_password;
		var new_password 		= req.body.new_password;
		var new_password2		= req.body.new_password2;


		req.checkBody('origin_password', 'password filed is required').notEmpty();
		req.checkBody('new_password', 'password filed is required').notEmpty();		
		req.checkBody('new_password2', 'Passwords do not match').equals(new_password);		


		var errors = req.validationErrors();
		if(errors){
			console.log('form has errors');
			req.flash('error', 'New password and confirm password are not same.');
			UsersModel.findById(id, function(err, results){
				if(err) {
					console.dir(err);
				}
			// console.log('find subscription ' + results.length);
			// console.log('results.name: ' + results[0].name);
				res.render('editPassword', {
					errors: errors,
					title:'Edit Password',
					user: req.user,
					results: results
				});
			});	

		}
		else{
			UsersModel.findOne({_id: ObjectId(id)}, function(err, user){
				if(err){
					res.send(err);
				}
				if(!user){
					req.flash('error', 'Database error, your profile is missing!')
					UsersModel.findById(id, function(err, results){
						if(err) {
							console.dir(err);
						}
					// console.log('find subscription ' + results.length);
					// console.log('results.name: ' + results[0].name);
						res.render('myProfile', {
							title:'My Profile',
							user: req.user,
							results: results
						});
					});
				}

				bcrypt.compare(origin_password, user.password, function(err, isMatch){
					if(err){
						res.send(err);
					}
					if(isMatch){
						bcrypt.genSalt(10, function(err, salt){
							bcrypt.hash(new_password, salt, function(err, hash){
								new_password = hash;
								UsersModel.update({_id:ObjectId(id)}, {$set: {'password':new_password}}, function(err, doc){
									if(err){
										res.send(err);
									}
									else{
										console.log('Password changed');
										//success msg
										req.flash('success', 'You have changed your password!');
										res.location('/users/login');
										res.redirect('/users/login');
									}
								});
							});
						});						
					}
					else{
						req.flash('error', 'Origin password is incorrect.');
						UsersModel.findById(id, function(err, results){
							if(err) {
								console.dir(err);
							}
						// console.log('find subscription ' + results.length);
						// console.log('results.name: ' + results[0].name);
							res.render('editPassword', {
								title:'Edit Password',
								user: req.user,
								results: results
							});
						});
					}
				});
			});			
		}
	}
);


//admin only
router.post('/editEmailAlert', ensureLoggedIn('login'), 
	function(req, res){
		//get form values
		var account 		= req.body.account;
		var password 		= req.body.password;

		var newAlert = {
                   account: account,
                   password: password
               }
		//insert
		AlertModel.findOneAndRemove({}, function(err, results){
			if(err) {
				console.log(err);
			}
			else {
				console.log("remove old admin email");
			}
			AlertModel.create(newAlert, function(err, doc){
				if(err){
					res.send(err);
				}
				else{
					console.log("Email Alert Account Set Success!");
					res.location('/');
					res.redirect("/");
				}
			});			
		});
});


router.get('/deleteSub', ensureLoggedIn('login'), function(req, res){
	JobSubsModel.findByIdAndRemove(req.query.id, function(err, event){
		if(err) {
			res.send(err);
		}
		else {
			JobSubsModel.find({userEmail: req.user.email}, function(err, results){
				if (err) {
		    		console.dir( err );
		    	}
		    	console.log('number of subcriptions: '+results.length);
				res.render('mySub',{title:'My subcriptions', user: req.user, results:results});
			}); 
		}
	})
});

router.get('/deleteJob', ensureLoggedIn('login'), function(req, res){
	var id = req.query.id;
    console.log(id);
    JobsModel.findByIdAndRemove(ObjectId(id), function(err, event){
        if(err){
            res.send(err);
        }
        else {
            console.log("delete event success!");                       
            res.location('/users/myEvent');
            res.redirect('/users/myEvent');
        }    
    }); 	
});

module.exports = router;


























