var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');

//var db = mongojs('eventapp', ['users','events','types','subs']);//used to store event types, e.g. Art, Agriculture, Computer...

//引用连接数据库Model
//var EventDB = require('../models/EventDB');

router.get('/', function(req, res, err){
	if (err) {
    	console.dir( err );
    }
	res.render('index',{title:'Home'});
});

module.exports = router;