var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');

var db = mongojs('eventapp', ['users','events','types','subs']);//used to store event types, e.g. Art, Agriculture, Computer...
var TypesModel = require('../models/TypeDB');

//mongoose
//type
router.get('/', function(req, res, err){
	if (err) {
    	console.dir( err );
    }
    TypesModel.find({}, function(err, results){
		if (err) {
    		console.dir( err );
    	}
    	//console.log('find types '+results.length);
		res.render('search',{title:'Search',results:results});//results are events types
	});
});

//mongodb
// router.get('/', function(req, res, err){
// 	if (err) {
//     	console.dir( err );
//     }
// 	var collection = db.collection('types');
// 	collection.find({}).toArray(function(err, results){
// 		if (err) {
//     		console.dir( err );
//     	}
//     	//console.log('find types '+results.length);
// 		res.render('search',{title:'Search',results:results});//results are events types
// 	});
// });

module.exports = router;