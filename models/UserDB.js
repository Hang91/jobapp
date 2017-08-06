/**
 * Created by Ying on 2017/08/03.
 */

//SubDB Model

//creat mongodb connection

var mongoose = require('mongoose');


//创建数据文档模板【在SQL数据库中 即一个表（列名字段等） NoSQL数据库中即数据文档（成员变量名）】
var userSchema = new mongoose.Schema({
    name: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	priority: {
		type: Number
	}
});

module.exports = mongoose.model('users', userSchema);
//yellow 'users' is the name of the collection