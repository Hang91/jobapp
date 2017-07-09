var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

var db = mongojs('eventapp', ['users','events','types','subs']);

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
//manage categories page - GET
router.get('/categories', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
	var collection = db.collection('types');
	collection.find({}).toArray(function(err, results){
		res.render('manage_categories', { title:'Manage Categories', user: req.user, results : results}); 
	});	
});



//manage categories page - GET
router.get('/events', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
	var collection = db.collection('events');
	collection.find({approved : 0}).toArray(function(err, results1){
		res.render('manage_events', { title:'Manage Events', user: req.user, results1 : results1}); 
	});	
});


function isAdmin(req, res, next) {

	 if ((!req.isAuthenticated()) || (req.user.name != 'admin')) {
	 	req.flash('error', 'Seems like you aren\'t an admin! '+req.user.name);
		res.redirect('/');
	 }
	 else{
	 	next();
	 }
};

module.exports = router;