var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

var db = mongojs('eventapp', ['users','events','types','subs']);
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/', ensureLoggedIn('login'), 
 function(req, res){
 	var collection = db.collection('subs');
	collection.find({userEmail: req.user.email}).toArray(function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	console.log('number of subcriptions: '+results.length);
		res.render('mySub',{title:'My subcriptions',results:results});
	}); 	
});