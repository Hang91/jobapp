

var mongoose = require('mongoose');

//创建数据文档模板【在SQL数据库中 即一个表（列名字段等） NoSQL数据库中即数据文档（成员变量名）】
var employmentTypesSchema = new mongoose.Schema({
    employmentType: {type: String}
});

module.exports = mongoose.model('employmenttypes', employmentTypesSchema);
//yellow 'employmentTypes' is the name of the collection