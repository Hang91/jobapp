var express = require('express');
var router = express.Router();

var EventDB = require('../models/EventDB');

var email 	= require('emailjs/email');



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


/*can display only one email*/
// router.get( "/" , function ( req , res , err ) {
//     if (err) {
//     	console.dir( err );
//     }

//     var collection = db.collection('users');

//     collection.findOne({email:String},function(err,item){
// 		if(err) {
// 	            console.log("There was a problem finding the events.");
// 	    } else {
// 	        console.log("events found!");
// 	        console.log(item);
// 	        res.render('events', { email: item["email"]});    	
// 	    } 
// 	}); 
// });



module.exports = router;
