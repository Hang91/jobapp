var express = require('express');
var router = express.Router();

//var EventDB = require('../models/EventDB');

var email 	= require('emailjs/email');
var mongojs = require('mongojs');
var db = mongojs('eventapp', ['users','events','types','subs']);
//Events - POST
//pagination
router.post('/', function (req, res, next) {
	console.log("events post");
	var limit = 5;
	var currentPage = 1;
    if(req.params.currentPage){
    	console.log("events post currentPage is not null");
    	currentPage = req.params.currentPage;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
	var collection = db.collection('events');
	var type = req.body.type;
	var keywords = req.body.keywords.split(',');
	var country = req.body.country;
	var state = req.body.state;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;

	//delete out-of-date events
	deleteOutDateEvents(collection, startDate);

	//search
	searchEvents(res, req.user, limit, currentPage, collection, type, keywords, country, state, startDate, endDate);	

});

//Events - GET
//pagination
router.get( "/" , function ( req , res , err ) {
	console.log("events get");
    var limit = 5;
    var currentPage = 1;
    if(req.query.currentPage){
    	currentPage = req.query.currentPage;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
	var collection = db.collection('events');
	//use trim() to delete space
	var type = req.query.type.trim();
	var keywords = req.query.keywords.trim().split(',');
	var country = req.query.country.trim();
	var state = req.query.state.trim();
	var startDate = req.query.startDate.trim();
	var endDate = req.query.endDate.trim();
	//delete out-of-date events
	deleteOutDateEvents(collection, startDate);
	//search
	searchEvents(res, req.user, limit, currentPage, collection, type, keywords, country, state, startDate, endDate);	
});


function searchEvents(res, user, limit, currentPage, collection, type, keywords, country, state, startDate, endDate)
{//search
	if(!type){
		var typeStr = {};
	}
	else{
		var typeStr = {'type' : type};
	}
	if(!keywords || (keywords.length == 1 && !keywords[0])){
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
    collection.find({$and: [typeStr, keywordsStr, countryStr, stateStr, startDateStr, endDateStr]}).toArray(function(err, rs){
    	if (err) {
            res.send(err);
        } else{
        	var totallength = rs.length;
        	var totalPage = Math.floor(totallength / limit);
        	
            if (totallength % limit != 0) {
                totalPage += 1;
            }
            if (totalPage != 0 && currentPage > totalPage) {
                currentPage = totalPage;
            }
            var query = collection.find({$and: [typeStr, keywordsStr, countryStr, stateStr, startDateStr, endDateStr]});
            query.skip((currentPage - 1) * limit);
            query.limit(limit);
            query.sort({startDate: 1});//sort by startDate
            query.toArray(function(err, results){
            	res.render('events', {title:'Search Results', 
            		type:type, keywords:keywords, 
            		country:country, state:state, 
            		startDate:startDate, endDate:endDate, 
            		totalPage:totalPage, currentPage:currentPage, 
            		results:results, totallength:totallength, user: user});
            });
        } 
	});
}
function deleteOutDateEvents(collection, startDate)
{
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
}

module.exports = router;
