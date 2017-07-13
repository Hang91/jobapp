/**
 * Created by Yi on 2017/5/8.
 */

//testDB Model

//创建 mongodb数据库连接

var mongoose = require('mongoose');
var DB = mongoose.connect('mongodb://localhost/eventapp');//红色为数据库名
//
mongoose.connection.on("open", function () {
    console.log("connection succeed");
});

//
mongoose.connection.on("error", function (error) {
    console.log("connection fail" + error);
});

//创建数据文档模板【在SQL数据库中 即一个表（列名字段等） NoSQL数据库中即数据文档（成员变量名）】
var typesSchema = new mongoose.Schema({
    type: {type: String}
});

module.exports = mongoose.model('types', typesSchema);
//yellow 'types' is the name of the collection