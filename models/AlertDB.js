/**
 * Created by Ying on 2017/08/06.
 */

//AlertDB Model
var mongoose = require('mongoose');


//创建数据文档模板【在SQL数据库中 即一个表（列名字段等） NoSQL数据库中即数据文档（成员变量名）】
var alertSchema = new mongoose.Schema({
	account: {
		type: String
	},
	password: {
		type: String
	}
});

module.exports = mongoose.model('alert', alertSchema);
//yellow 'alert' is the name of the collection