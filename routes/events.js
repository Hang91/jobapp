var express = require('express');
var router = express.Router();

var EventDB = require('../models/EventDB');

var email 	= require('emailjs/email');

router.post('/',function(req, res){
	console.log('search location...');
	req.flash('success', 'Searching...');
	var collection = db.collection('events');
	var country = req.body.country;
	var city_state = req.body.city_state;
	if(!country){
		console.log('find all...');
		collection.find({}).toArray(function(err, results){
			//to events.ejs
			res.render('events', {results:results, user: req.user});
		});
	}
	else if(!city_state){
		console.log('find all...');
		collection.find({'country' : country}).toArray(function(err, results){
			//to events.ejs
			res.render('events', {results:results, user: req.user});
		});
	}
	else{
		collection.find({$and: [{'country' : country}, {$or: [{'state' : city_state}, {'city' : city_state}]}]}).toArray(function(err, results){
			res.render('events', {results:results, user: req.user}); 
		});
	}
});

router.get( "/" , function ( req , res , err ) {
    if (err) {
    	console.dir( err );
    }

    var collection = db.collection('events');
    collection.find({}).toArray(function(err, results) {
   		// send HTML file populated with quotes here
   		//send email
		var server 	= email.server.connect({
		   user:    "jinhang91@hotmail.com", 
		   password:"Jin3528708317Hang", 
		   host:	"smtp-mail.outlook.com", 
		   tls: {ciphers: "SSLv3"}
		});

		var message	= {
		   text:	"i hope this works", 
		   from:	"you <jinhang91@hotmail.com>", 
		   to:		"zhuyingcau <zhuyingcau@126.com>",
		   cc:		"",
		   subject:	"testing emailjs"
		   /*
		   attachment: 
		   [
		      {data:"<html>i <i>hope</i> this works!</html>", alternative:true},
		      {path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
		   ]
		   */
		};

		// send the message and get a callback with an error or details of the message that was sent
		server.send(message, function(err, message) { console.log(err || message); });




   		//to events.ejs
   		res.render('events', {results:results});  
 	})


});



module.exports = router;
