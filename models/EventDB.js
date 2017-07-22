/**
 * Created by Ying on 2017/07/17.
 */


var mongoose = require('mongoose');
var DB = mongoose.connect('mongodb://localhost/eventapp');//红色为数据库名
mongoose.Promise = global.Promise;
mongoose.connection.on("open", function () {
    console.log("connection succeed");
});

//
mongoose.connection.on("error", function (error) {
    console.log("connection fail" + error);
});

//创建数据文档模板【在SQL数据库中 即一个表（列名字段等） NoSQL数据库中即数据文档（成员变量名）】
var eventsSchema = new mongoose.Schema({
    name: {
		type: String
	},
	type: {
		type: String
	},
	region : {
		type: String
	},
	city : {
		type: String
	},
	state: {
		type: String
	},
	country: {
		type:String
	},
	organization: {
		type: String
	},
	contact: {
		type: String
	},
	email: {
		type: String
	},
	website: {
		type: String
	},
	startDate: {
		type: String
	},
	endDate: {
		type: String
	},
	deadline: {
		type: String
	},
	description: {
		type: String
	},
	keywords: {
		type: Array
	},
	approved: {
		type: Number
	},
	userName: {
		type: String
	},
	userEmail: {
		type: String
	}
});

module.exports = mongoose.model('events', eventsSchema);







