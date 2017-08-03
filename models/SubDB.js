/**
 * Created by Ying on 2017/08/03.
 */

//SubDB Model

//creat mongodb connection

var mongoose = require('mongoose');


//创建数据文档模板【在SQL数据库中 即一个表（列名字段等） NoSQL数据库中即数据文档（成员变量名）】
var subsSchema = new mongoose.Schema({
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
	startDate: {
		type: String
	},
	endDate: {
		type: String
	},
	keywords: {
		type: Array
	},
	userName: {
		type: String
	},
	userEmail: {
		type: String
	}
});

module.exports = mongoose.model('subs', subsSchema);
//yellow 'subs' is the name of the collection