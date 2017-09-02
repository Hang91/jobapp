

var mongoose = require('mongoose');


//创建数据文档模板【在SQL数据库中 即一个表（列名字段等） NoSQL数据库中即数据文档（成员变量名）】
var jobsubsSchema = new mongoose.Schema({
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
	deadline: {
		type: String
	},
	salary: {
		type: Number
	},
	userName: {
		type: String
	},
	userEmail: {
		type: String
	},
	keywords: {
		type: Array
	}
});

module.exports = mongoose.model('jobsubs', jobsubsSchema);
//yellow 'subs' is the name of the collection