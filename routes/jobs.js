var express = require('express');
var router = express.Router();

var email 	= require('emailjs/email');
var mongojs = require('mongojs');
//###########mongoose#########
var JobModel = require('../models/JobDB');
var EmploymentTypeModel = require('../models/EmploymentTypeDB');

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
	var region = req.body.region;
	var country = req.body.country;
	var state = req.body.state;
	var deadline = req.body.deadline;
	var salary = req.body.salary;
	var approved = 1;
	var datePosted = "";
	//search
	searchJobs(res, req.user, limit, currentPage, employmentType, positionType,
		field, keywords, region, country, state, deadline, salary, datePosted, approved);	

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
	if(req.query.employmentType != null){
		var employmentType = req.query.employmentType.trim();
	}
	else{
		var employmentType = "";
	}
	var positionType = req.query.positionType.trim();
	var field = req.query.field.trim();
	var keywords = req.query.keywords.trim().split(',');
	var region = req.query.region.trim();
	var country = req.query.country.trim();
	var state = req.query.state.trim();
	var deadline = req.query.deadline.trim();
	var salary = req.query.salary.trim();
	var approved = 1;
	if(req.query.datePosted != null){
		var datePosted = req.query.datePosted.trim();
	}
	else{
		var datePosted = "";
	}
	//delete out-of-date events
	//deleteOutDateJobs(deadline);
	//search
	searchJobs(res, req.user, limit, currentPage, employmentType, positionType,
		field, keywords, region, country, state, deadline, salary, datePosted, datePosted, approved);		
});


function searchJobs(res, user, limit, currentPage, employmentType, positionType, 
	field, keywords, region, country, state, deadline, salary, datePosted, approved)
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
	if(!region){
		var regionStr = {};
	}
	else{
		var regionStr = {'region' : region};
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
	if(!datePosted){
		var postDateStr = {};
	}
	else{
		var currentDate = new Date();
		currentDate.setDate(currentDate.getDate()-datePosted-1);
		var dd = currentDate.getDate();
		var mm = currentDate.getMonth()+1; //January is 0!
		var yyyy = currentDate.getFullYear();

		if(dd<10) {
		    dd = '0'+dd
		} 

		if(mm<10) {
		    mm = '0'+mm
		} 

		currentDate = yyyy + '-' + mm + '-' + dd;
		var postDateStr = {'postDate' : {$gte:currentDate}};
	}
	var approvedStr = {'approved' : 1};

    JobModel.find({$and: [employmentTypeStr, positionTypeStr, fieldStr, keywordsStr, regionStr, countryStr, stateStr, deadlineStr, salaryStr, postDateStr, approvedStr]}, function(err, rs){
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
            var query = JobModel.find({$and: [employmentTypeStr, positionTypeStr, fieldStr, keywordsStr, regionStr, countryStr, stateStr, deadlineStr, salaryStr, postDateStr, approvedStr]});
            query.skip((currentPage - 1) * limit);
            query.limit(limit);
            query.sort('-deadline').exec(function(err, results) { 
            	EmploymentTypeModel.find({}, function(err, employmentTypeResults){
					if (err) {
			    		console.dir( err );
			    	}
					res.render('jobs', {title:'Search Results', 
            		positionType:positionType, employmentType:employmentType,
            		field:field, keywords:keywords, 
            		region:region, country:country, state:state, 
            		deadline:deadline, salary:salary, datePosted:datePosted,
            		totalPage:totalPage, currentPage:currentPage, 
            		employmentTypeResults:employmentTypeResults,
            		results:results, totallength:totallength, user: user
            		});
				});
            });
        } 
	});
}


module.exports = router;
