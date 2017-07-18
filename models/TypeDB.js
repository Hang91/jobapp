/**
 * Created by Ying on 2017/7/14.
 */

//TypeDB Model

//creat mongodb connection

var mongoose = require('mongoose');


//创建数据文档模板【在SQL数据库中 即一个表（列名字段等） NoSQL数据库中即数据文档（成员变量名）】
var typesSchema = new mongoose.Schema({
    type: {type: String}
});

module.exports = mongoose.model('types', typesSchema);
//yellow 'types' is the name of the collection