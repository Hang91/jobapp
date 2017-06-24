var express = require('express');
var router = express.Router();

var EventDB = require('../models/EventDB');


router.get( "/" , function ( req , res , err ) {
    if (err) {
    	console.dir( err );
    }

    var collection = db.collection('events');
    EventDB.find({}, function(err, events){
    	if(err){
			console.dir( err );
    	}
    	console.dir( 'success' );
    	res.render('events', {events:events}); 
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
