var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('eventapp', ['users']);

//引用连接数据库Model
var EventDB = require('../models/EventDB');

router.get('/', function(req, res){
	res.render('index');
});
// test 数据
// var resData = [];
// resData.push(
//     {
//         SortID: "1",
//         Name: "A",
//         Sex: "女",
//         Address: "SSS",
//         timeDate: "05-08"
//     }
// );
// resData.push(
//     {
//         SortID: "2",
//         Name: "B",
//         Sex: "男",
//         Address: "XXX",
//         timeDate: "05-08"26//     }
// );
// 初始化回显 数据库已录入数据


// router.get('/', function(req, res, next){
// 	EventDB.getEvents(function(err, docs){
// 		if(err){
// 			res.send(err);
// 		}
// 		res.json(docs);
// 		// res.render('index',{
// 		// 	"userlist": docs
// 		// });
// 	},10);
// });

// router.get('/', function(req, res, next){
// 	//var collection = db.get('users');
// 	EventModel.find({},{},function(e,docs){
// 		res.render('index',{
// 			"userlist": docs
// 		});
// 	});
// 	// res.render('testDB', {title: 'Express'});
// 	// EventModel.find({},function(err, resData){
// 	// 	if(err){
// 	// 		return next(err);
// 	// 	}
// 	// 	res.render('index',{
// 	// 		title:"TestDB",
// 	// 		testData:resData
// 	// 	});
// 	// });
// });

//1 可以直接用Form表单方式提交数据
//2 或者通过页面脚本绑定事件响应结合JQuery的Ajax
//实现调用路由（controller）接口将数据写入数据库
//一般开发中会在页面脚本中调用很多其他或者外部接口//【该方式比较常用 即就把路由方法当成一个对外的接口】


/*
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}
*/

// db.users.find({}, {events:1});
// router.post('/', 
//   function(req, res){
//   	console.log('display');
//   	res.redirect('/');
//   }
// );

module.exports = router;