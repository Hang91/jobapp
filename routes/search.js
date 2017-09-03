var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');

var db = mongojs('eventapp', ['users','events','types','subs']);//used to store event types, e.g. Art, Agriculture, Computer...
var EmploymentTypeModel = require('../models/EmploymentTypeDB');

//mongoose
//type
router.get('/', function(req, res, err){
	if (err) {
    	console.dir( err );
    }
    EmploymentTypeModel.find({}, function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	//console.log('find types '+results.length);
		res.render('search',{title:'Search',results:results});//results are events types
	});
});

module.exports = router;