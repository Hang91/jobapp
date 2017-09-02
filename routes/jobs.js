var express = require('express');
var router = express.Router();

var email 	= require('emailjs/email');
var mongojs = require('mongojs');
//var db = mongojs('eventapp', ['users','events','types','subs']);
//###########mongoose#########
var JobModel = require('../models/JobDB');
//Events - POST
//pagination
router.post('/', function (req, res, next) {
	console.log("jobs post");
	var limit = 10;
	var currentPage = 1;
    if(req.params.currentPage){
    	currentPage = req.params.currentPage;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
	var employmentType = req.body.employmentType;
	var positionType = req.body.positionType;
	var field = req.body.field;
	var keywords = req.body.keywords.split(',');
	var country = req.body.country;
	var state = req.body.state;
	var deadline = req.body.deadline;
	var salary = req.body.salary;
	var approved = 1;
	//delete out-of-date events
	//deleteOutDateEvents(startDate);

	//search
	searchJobs(res, req.user, limit, currentPage, employmentType, positionType,
		field, keywords, country, state, deadline, salary, approved);	

});

//Jobs - GET
//pagination
router.get( "/" , function ( req , res , err ) {
	//console.log("events get");
    var limit = 10;
    var currentPage = 1;
    if(req.query.currentPage){
    	currentPage = req.query.currentPage;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
	//use trim() to delete space
	var employmentType = req.query.employmentType.trim();
	var positionType = req.query.positionType.trim();
	var field = req.query.field.trim();
	var keywords = req.query.keywords.trim().split(',');
	var country = req.query.country.trim();
	var state = req.query.state.trim();
	var deadline = req.query.deadline.trim();
	var salary = req.query.salary.trim();
	var approved = 1;
	//delete out-of-date events
	deleteOutDateJobs(deadline);
	//search
	searchJobs(res, req.user, limit, currentPage, employmentType, positionType,
		field, keywords, country, state, deadline, salary, approved);		
});


function searchJobs(res, user, limit, currentPage, employmentType, positionType, 
	field, keywords, country, state, deadline, salary, approved)
{//search
	if(!employmentType){
		var employmentTypeStr = {};
	}
	else{
		var employmentTypeStr = {'employmentType' : employmentType};
	}
	if(!positionType){
		var positionTypeStr = {};
	}
	else{
		var positionTypeStr = {'positionType' : positionType};
	}
	if(!field){
		var fieldStr = {};
	}
	else{
		var fieldStr = {'field' : field};
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
	if(!deadline){
		var deadlineStr = {};
	}
	else{
		var deadlineStr = {'deadline': {$gte:deadline}};
	}
	if(!salary){
		var salaryStr = {};
	}
	else{
		var salaryStr = {'salary': {$gte:salary}};
	}
	var approvedStr = {'approved' : 1};

    JobModel.find({$and: [employmentTypeStr, positionTypeStr, fieldStr, keywordsStr, countryStr, stateStr, deadlineStr, salaryStr, approvedStr]}, function(err, rs){
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
            var query = JobModel.find({$and: [employmentTypeStr, positionTypeStr, fieldStr, keywordsStr, countryStr, stateStr, deadlineStr, salaryStr, approvedStr]});
            query.skip((currentPage - 1) * limit);
            query.limit(limit);
            query.sort('-deadline').exec(function(err, results) { 
            	res.render('jobs', {title:'Search Results', 
            		positionType:positionType, employmentType:employmentType,
            		field:field, keywords:keywords, 
            		country:country, state:state, 
            		deadline:deadline, salary:salary, 
            		totalPage:totalPage, currentPage:currentPage, 
            		results:results, totallength:totallength, user: user});
            });
        } 
	});
}
function deleteOutDateJobs(deadline)
{
	//delete out-of-date jobs
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
	//console.log(today);
	JobModel.remove({'deadline': {$lt:today}})
}

module.exports = router;
