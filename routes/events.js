var express = require('express');
var router = express.Router();

var EventDB = require('../models/EventDB');

var email 	= require('emailjs/email');

router.post('/',function(req, res){
	console.log('search events...');
	var collection = db.collection('events');
	var type = req.body.type;
	var keywords = req.body.keywords;
	var country = req.body.country;
	var state = req.body.state;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;

	if(!type){
		var typeStr = {};
	}
	else{
		var typeStr = {'type' : type};
	}
	if(!keywords){
		var keywordsStr = {};
	}
	else{
		var keywordsStr = {'keywords' : keywords};
	}
	if(!country){
		var countryStr = {};
	}
	else{
		var countryStr = {'country' : country};
	}
	if(!state){
		var stateStr = {};
	}
	else{
		var stateStr = {'state' : state};
	}
	if(!startDate){
		var startDateStr = {};
	}
	else{
		var startDateStr = {'startDate': {$gte:startDate}};
	}
	if(!endDate){
		var endDateStr = {};
	}
	else{
		var endDateStr = {'endDate' : {$lte:endDate}};
	}
	collection.find({$and: [typeStr, keywordsStr, countryStr, stateStr, startDateStr, endDateStr]}).toArray(function(err, results){
		res.render('events', {title:'Search Results', results:results, user: req.user}); 
	});
	
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
   		res.render('events', {title:'Search Results', results:results});  
 	})


});



module.exports = router;
