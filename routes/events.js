var express = require('express');
var router = express.Router();

var EventDB = require('../models/EventDB');

var email 	= require('emailjs/email');

router.post('/',function(req, res){
	console.log('search events...');
	var collection = db.collection('events');
	var type = req.body.type;
	var keywords = req.body.keywords.split(',');
	var country = req.body.country;
	var state = req.body.state;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;

	//delete out-of-date events
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd = '0'+dd
	} 

	if(mm<10) {
	    mm = '0'+mm
	} 

	today =  yyyy + '-' + mm + '-' + dd;
	console.log(today);
	collection.remove({'startDate': {$lt:today}})

	if(!type){
		var typeStr = {};
	}
	else{
		var typeStr = {'type' : type};
	}
	if(keywords.length == 1 && !keywords[0]){
		var keywordsStr = {};
	}
	else{
		//var keywordsStr = {'keywords': {$in:keywords}};//or
		var keywordsStr = {'keywords': {$all:keywords}};//and
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
