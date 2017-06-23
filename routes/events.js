var express = require('express');
var router = express.Router();

var EventDB = require('../models/EventDB');

var api = require('../lib/api');

router.get('/', function(req, res, next){
	EventDB.find(function(err, events){
		if(err){
			res.send(err);
		}
		//for(i = 0; i < events.length; i++){
			res.json(events);
		//}
		
	}).limit(10);
	// EventDB.getEvents(function(err, events){
	// 	if(err){
	// 		res.send(err);
	// 	}
	// 	res.json(events);
	// },10);
});

// router.get('/', function(req, res, next) {
// 	//返回所有
// 	api.find()
// 		.then(res => {
// 			console.log(res)			
// 		})
// 	// //返回只包含一个键值name、age的所有记录
// 	api.find({},{name:1, email:1})
// 		.then(result => {
// 			res.render('events',{result:result});			
// 		})
// 	//返回所有age大于18的数据
// 	// api.find({"age":{"$gt":18}})
// 	// 	.then(result => {
// 	// 		console.log(result)			
// 	// 	})
// 	//返回20条数据
// 	api.find({},null,{limit:20})
// 		.then(result => {
// 			console.log(result)			
// 		})

// 	//查询所有数据，并按照age降序顺序返回数据
// 	// api.find({},null,{sort:{age:-1}}) //1是升序，-1是降序
// 	// 	.then(result => {
// 	// 		console.log(result)			
// 	// 	})
// })

module.exports = router;
