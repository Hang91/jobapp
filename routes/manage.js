var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

var db = mongojs('eventapp', ['users','events','types','subs']);

//manage categories page - GET
router.get('/categories', function(req, res){
	var collection = db.collection('types');
	collection.find({}).toArray(function(err, results){
		res.render('manage_categories', { title:'Manage Categories', user: req.user, results : results}); 
	});	
});

//manage categories page - GET
router.get('/events', function(req, res){
	var collection = db.collection('events');
	collection.find({approved : 0}).toArray(function(err, results1){
		res.render('manage_events', { title:'Manage Events', user: req.user, results1 : results1}); 
	});	
});

module.exports = router;