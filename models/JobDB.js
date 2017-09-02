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
var jobsSchema = new mongoose.Schema({
    name: {
		type: String
	},
	positionType: {
		type: String
	},
	employmentType: {
		type: String
	},
	field: {
		type: String
	},
	region: {
		type: String
	},
	city: {
		type: String
	},
	state: {
		type: String
	},
	country: {
		type:String
	},
	institution: {
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
	deadline: {
		type: String
	},
	salary: {
		type: Number
	},
	description: {
		type: String
	},
	userName: {
		type: String
	},
	userEmail: {
		type: String
	},
	keywords: {
		type: Array
	},
	approved: {
		type: Number
	},
	comments: {
		type: String
	}
});

module.exports = mongoose.model('jobs', jobsSchema);
//yellow 'subs' is the name of the collection