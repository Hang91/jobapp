var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('eventapp', ['users','events','types','subs']);
//var TypesModel = require('../models/TypeDB');

var JobsModel = require('../models/JobDB');
var UsersModel = require('../models/UserDB');
var SubsModel = require('../models/JobSubDB');
var AlertsModel = require('../models/AlertDB');
var employmentTypesModel = require('../models/EmploymentTypeDB');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var email   = require('emailjs/email');

var ObjectId = require('mongodb').ObjectID;


var json2csv = require('json2csv');
var fs = require('fs');

function searchUsers(res, user, limit, currentPage)
{
    UsersModel.find({priority : 0},function(err, users){//usrs
        if(err){
            return next(err);
        }
        var totallength = users.length;
        var totalPage = Math.floor(totallength / limit);
        
        if (totallength % limit != 0) {
            totalPage += 1;
        }
        if (totalPage != 0 && currentPage > totalPage) {
            currentPage = totalPage;
        }
        //console.log("currentPage: "+currentPage);
        UsersModel.find({priority : 0}).skip((currentPage - 1) * limit).limit(limit).sort('name').exec(function(err, users1) { 
            UsersModel.find({priority : 1},function(err2, users2){//managers
                if(err2){
                    return next(err2);
                }
                //console.log(results2.length);
                UsersModel.find({priority : 2},function(err3, users3){//only one admin
                    if(err3){
                    return next(err3);
                }
                    //console.log(results3.length);
                    res.render('manage_users', { title:'Manage | Manage Users', user:user, 
                        users1 : users1, users2 : users2, users3 : users3, totalPage:totalPage, currentPage:currentPage, totallength:totallength}); 
                }); 
            }); 
        });
    });
}
//manage users page - GET
//pagination
router.get('/users', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var limit = 10;
    var currentPage = 1;
    if(req.query.currentPage){
        currentPage = req.query.currentPage;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
    searchUsers(res, req.user, limit, currentPage);
});

//promote one user to manager
router.get('/users/promote', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var id = req.query.id;
    var limit = 10;
    var currentPage = 1;
    UsersModel.update({_id:ObjectId(id)}, {$set:{priority:1}}, function(err, user){//1 is manager
        if(err){
            res.send(err);
        }
        else {
            searchUsers(res, req.user, limit, currentPage);
        }    
    });
});

//demote one manager to user
router.get('/users/demote', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var id = req.query.id;
    var limit = 10;
    var currentPage = 1;
    UsersModel.update({_id:ObjectId(id)}, {$set:{priority:0}}, function(err, user){//0 is user
        if(err){
            res.send(err);
        }
        else {
            searchUsers(res, req.user, limit, currentPage);
        }    
    });
});

//click download button in manage users page 
//- GET - download using json2csv
router.get('/users/download', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var fields = ['userName', 'userEmail', 'name', 'type', 'city', 'state', 'country', 'region', 
        'organization', 'startDate', 'endDate', 'keywords'];
    //find all subscriptions sorted by userName
    SubsModel.find({}).sort('userName').exec(function(err, results){
        if(err){
            res.json(err);
        }
        //console.log(results3.length);
        var csv = json2csv({ data: results, fields: fields });

        var path='UsersSubscription'+Date.now()+'.csv';
        
        fs.writeFile(path, csv, function(err) {
            if (err) {
                throw err;
            }
            console.log('File saved');
            //res.download(path);
            req.flash('success', 'Successfully download users\' subscription!');
            res.location('/manage/users');
            res.redirect('/manage/users');
        });
    }); 
});

//*****************   Jobs  ********************************
function searchJobs(res, user, limit, tab, currentPage1,currentPage2,currentPage3)
{
    JobsModel.find({approved : 0},function(err1, results1){//to be approve
        if(err1){
            return next(err1);
        }
        var totallength1 = results1.length;
        var totalPage1 = Math.floor(totallength1 / limit);
        
        if (totallength1 % limit != 0) {
            totalPage1 += 1;
        }
        if (totalPage1 != 0 && currentPage1 > totalPage1) {
            currentPage1 = totalPage1;
        }
        JobsModel.find({approved : 0}).skip((currentPage1 - 1) * limit).limit(limit).sort('deadline').sort('city').sort('country').exec(function(err11, results11) {
        //console.log(results11.length);
                if(err11){
                    return next(err11);
                }
                JobsModel.find({approved : 1},function(err2, results2){//approve
                if(err2){
                    return next(err2);
                }
                var totallength2 = results2.length;
                var totalPage2 = Math.floor(totallength2 / limit);
                
                if (totallength2 % limit != 0) {
                    totalPage2 += 1;
                }
                if (totalPage2 != 0 && currentPage2 > totalPage2) {
                    currentPage2 = totalPage2;
                }
                //console.log(results2.length);
                JobsModel.find({approved : 1}).skip((currentPage2 - 1) * limit).limit(limit).sort('deadline').sort('city').sort('country').exec(function(err22, results22) {
                    if(err22){
                        return next(err22);
                    }
                    JobsModel.find({approved : 3},function(err3, results3){//revise
                        if(err3){
                            return next(err3);
                        }
                        var totallength3 = results3.length;
                        var totalPage3 = Math.floor(totallength3 / limit);
                        
                        if (totallength3 % limit != 0) {
                            totalPage3 += 1;
                        }
                        if (totalPage3 != 0 && currentPage3 > totalPage3) {
                            currentPage3 = totalPage3;
                        }
                        JobsModel.find({approved : 3}).skip((currentPage3 - 1) * limit).limit(limit).sort('deadline').sort('city').sort('country').exec(function(err33, results33) {
                            res.render('manage_jobs', { title:'Manage | Manage Jobs', user:user, 
                                results1 : results11, results2 : results22, results3 : results33,
                                totalPage1:totalPage1, totalPage2:totalPage2, totalPage3:totalPage3,
                                currentPage1:currentPage1,currentPage2:currentPage2,currentPage3:currentPage3, 
                                totallength1:totallength1,totallength2:totallength2,totallength3:totallength3});                            
                        });
                    }); 
                });
            }); 
        });
    });
}
//manage jobs page - GET
router.get('/jobs', ensureLoggedIn('/users/login'), isManager, function(req, res){
    var limit = 5;
    var currentPage1 = 1;
    var currentPage2 = 1;
    var currentPage3 = 1;
    var tab = req.query.tab;
    if(req.query.currentPage1){
        currentPage1 = req.query.currentPage1;
    }
    if(req.query.currentPage2){
        currentPage2 = req.query.currentPage2;
    }
    if(req.query.currentPage3){
        currentPage3 = req.query.currentPage3;
    }
    if (currentPage1 < 1) {
        currentPage1 = 1;
    }
    if (currentPage2 < 1) {
        currentPage2 = 1;
    }
    if (currentPage3 < 1) {
        currentPage3 = 1;
    }
    searchJobs(res, req.user, limit, tab, currentPage1, currentPage2, currentPage3);
});


//check detail of an job
router.get('/jobs/details', ensureLoggedIn('/users/login'), isManager, function(req, res){
    var id = req.query.id;
    //console.log(id);
    employmentTypesModel.find({}, function(err, types){
        if(err){
            return next(err);
        }
        JobsModel.findById(id, function(err, job){
            if(err){
                res.send(err);
            }
            res.render('jobs_details', {title: 'Manage | Job Details', 
                user: req.user, employmentTypes:types, job:job});
        });
    });
});

//edit & approve / disapprove / ask for revision
router.post('/jobs/details', ensureLoggedIn('/users/login'), isManager, function(req, res){
    if(req.body.manage_job_detail == "disapprove"){
            var id  = req.body.id;
            JobsModel.findByIdAndRemove(ObjectId(id), function(err, job){
                    if(err){
                        res.send(err);
                    }
                    else {
                        console.log("disapprove success!");
                        req.flash('success', 'Successfully disapproved!');
                        res.location('/manage/jobs');
                        res.redirect('/manage/jobs');
                        //searchEvents(res, req.user, limit, currentPage, 0, false);
                    }    
                });
    }
    //get form values
    var id        = req.body.id;
    var name        = req.body.name;
    var positionType = req.body.positionType;
    var employmentType = req.body.employmentType;
    var field = req.body.field;
    var city    = req.body.city;
    var state   = req.body.state;
    var country     = req.body.country;
    var region      = req.body.region;
    var institution    = req.body.institution;
    var contact     = req.body.contact;
    var email   = req.body.email;
    var website     = req.body.website;
    // var startDate   = req.body.startDate;
    // var endDate = req.body.endDate;
    var deadline = req.body.deadline;
    var salary = req.body.salary;
    var description = req.body.description;
    var comments = req.body.comments;
    if(typeof req.body.keywords == 'string') {
        var keywords    = req.body.keywords.split(",");
    } else {
        var keywords = null;
        console.log('keywords is not a string');
    }

    if(req.body.manage_job_detail == "revise"){
        
        var approved = 3;//0:not check yet; 1:approve; 2:disapprove; 3.ask for revision

        var newJob = {
                   name: name,
                   positionType: positionType,
                   employmentType: employmentType,
                   field: field,
                   region: region,//continent
                   country: country,
                   state: state,
                   city: city,
                   institution: institution,
                   contact: contact,
                   email: email,
                   website: website,
                   // startDate: startDate,
                   // endDate: endDate,
                   deadline: deadline,
                   salary: salary,
                   description: description,
                   keywords: keywords,
                   approved: approved,
                   comments: comments
            }
        //update
        JobsModel.update({_id:ObjectId(id)}, {$set:newJob}, function(err, doc){
        if(err){
            res.send(err);
        }
        else{
            console.log('ask for revision success!');
            //success msg
            //alertUser(newEvent);
            informUser(id);
            req.flash('success', 'Successfully ask for revision!');
            res.location('/manage/jobs');
            res.redirect('/manage/jobs');
        }
        });
    }
    else if(req.body.manage_job_detail == "approve"){
        var approved = 1;//0:not check yet; 1:approve; 2:disapprove; 3.ask for revision

        var newJob = {
                   name: name,
                   positionType: positionType,
                   employmentType: employmentType,
                   field: field,
                   region: region,//continent
                   country: country,
                   state: state,
                   city: city,
                   institution: institution,
                   contact: contact,
                   email: email,
                   website: website,
                   // startDate: startDate,
                   // endDate: endDate,
                   deadline: deadline,
                   salary: salary,
                   description: description,
                   keywords: keywords,
                   approved: approved,
                   comments: comments
            }
        //update
        JobsModel.update({_id:ObjectId(id)}, {$set: newJob}, function(err, doc){
        if(err){
            res.send(err);
        }
        else{
            console.log('approve success!');
            //success msg
            informUser(id);//inform the auther
            alertUser(newJob);//inform all subscribers
            req.flash('success', 'Successfully approved!');
            res.location('/manage/jobs');
            res.redirect('/manage/jobs');
        }
        });
    }
    
});

//approve an job
router.get('/jobs/approve', ensureLoggedIn('/users/login'), isManager, function(req, res){
    var id = req.query.id;
    //console.log("in the approve function， id="+id);
    JobsModel.update({_id:ObjectId(id)}, {$set:{approved:1}}, function(err, job){
        if(err){
            res.send(err);
        }
        else {            
            //email alert
            JobsModel.findById(id, function(err, job){
                informUser(id);
                alertUser(job);
                informUser(id);//inform the auther
                console.log("approve success!");
                res.location('/manage/jobs');
                res.redirect('/manage/jobs');                            
            });
        }    
    });
});

//disapprove an job - delete
router.get('/jobs/disapprove', ensureLoggedIn('/users/login'), isManager, function(req, res){
    var id = req.query.id;
    //console.log(id);
    JobsModel.findByIdAndRemove(ObjectId(id), function(err, job){
        if(err){
            res.send(err);
        }
        else {
            console.log("disapprove success!");
            res.location('/manage/jobs');
            res.redirect('/manage/jobs'); 
        }    
    });
});

//************   categories   **************************
//manage categories page - GET
router.get('/categories', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
	employmentTypesModel.find({}, function(err, results){
		if(err){
			return next(err);
		}
		res.render('manage_categories', {title:'Manage | Manage Categories', user: req.user, results : results});
	});
	// var collection = db.collection('types');
	// collection.find({}).toArray(function(err, results){
	// 	res.render('manage_categories', { title:'Manage Categories', user: req.user, results : results}); 
	// });	
});

//add type
//use ajax post (use get cannot work)
router.get('/categories/add', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
	var employmentType = req.query.employmentType;
   //MogoDB中可以用Create方法添加数据
    employmentTypesModel.create({employmentType:employmentType}, function (err) {
        if (err) res.send({result:-1});
        else {
            employmentTypesModel.find({}, function (error, results) {
                if (error) res.send({result:-1});
                else {
                    // res.send({result:1});
                    console.log("add success!");
                    res.location('/manage/categories');
                    res.redirect("/manage/categories");
                    //res.render('manage_categories', {title:'Manage Categories', user: req.user, results : results});

                }
            });
        }
    });
});

//edit type
router.get('/categories/edit', ensureLoggedIn('/users/login'), isAdmin,function(req, res){
    var id = req.query._id;
    //console.log("edit type:"+id);
    var employmentType = req.query.employmentType;
    employmentTypesModel.update({_id:ObjectId(id)}, {$set:{employmentType:employmentType}},{}, function(err, next){
        if(err){
            res.send(err);
        }
        else {
            employmentTypesModel.find({}, function (error, results) {
                if (error){ 
                    console.log("edit error!");
                    res.send({result:-1});
                }
                else {
                    console.log("edit success!");
                    res.location('/manage/categories');
                    res.redirect("/manage/categories");
                    //res.render('manage_categories', {title:'Manage Categories', user: req.user, results : results});
                }
            });
        }    
    });
});

//delete type according to _id
router.get('/categories/delete', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
	var id = req.query._id;
    //console.log("delete type:"+id);
   //MogoDB use remove function to remove data
    employmentTypesModel.findByIdAndRemove(ObjectId(id), function (err) {
        if (err){ 
            console.log("delete err!");
            res.send({result:-1});
        }
        else {
            employmentTypesModel.find({}, function (error, results) {
                if (error){ 
                    console.log("delete error!");
                    res.send({result:-1});
                }
                else {
                    console.log("delete success!");
                    res.location('/manage/categories');
                    res.redirect("/manage/categories");
                }
            });
        }
    });
});



function isAdmin(req, res, next) {

	 if ((!req.isAuthenticated()) || (req.user.priority != 2)) {
	 	req.flash('error', 'Seems like you aren\'t an admin! '+req.user.name);
		res.redirect('/');
	 }
	 else{
	 	next();
	 }
};

function isManager(req, res, next) {
   if ((!req.isAuthenticated()) || (req.user.priority < 1)) {
    req.flash('error', 'Seems like you aren\'t an manager! '+req.user.name);
    res.redirect('/');
   }
   else{
    next();
   }
};

function informUser(id) {
  console.log("inform user");
  AlertsModel.findOne(function(err, results){
    if(err) {
      console.log(err);
    }
    var adminPw = results.password;
    var adminEmail = results.account;
    console.log("adminEmail: " + adminEmail);
    console.log("admintPw: " + adminPw);
    var server  = email.server.connect({
      user:  adminEmail, 
      password: adminPw,
      host:  "smtp-mail.outlook.com", 
      tls: {ciphers: "SSLv3"}
    });

    JobsModel.findById(id, function(err, jobs){
      if(err) {
        console.log(err);
      }
      if(jobs.approved == 3) { //revise
        var message = {
          text:  "Hello " + jobs.userName + ", you have a job to revise. Please log in your jobapp account " +
           "to get detail information. ",
          from:  "you <jinhang91@hotmail.com>", 
          to:    jobs.userName + "<" + jobs.userEmail + ">",
          cc:    "",
          subject: "testing email js"
        };

        server.send(message, function(err, message) { 
            console.log(err || message); 
        });
      }
      else if(jobs.approved == 1) { //approved
        var message = {
          text:  "Hello " + jobs.userName + ", you hava a job approved. You can log in your jobapp account " +
           "to get detail information",
          from:  "you <jinhang91@hotmail.com>", 
          to:    "zhuyingcau <" + jobs.userEmail + ">",
          cc:    "",
          subject: "testing email js"
        };

        server.send(message, function(err, message) { 
            console.log(err || message); 
        });    
      }
    });
  });

  // send the message and get a callback with an error or details of the message that was sent

}

function alertUser(newJob) {
  console.log("alert User");

  AlertsModel.findOne(function(err, emails){
    if(err) {
      console.log(err);
    }

    var adminEmail = emails.account;
    var adminPw = emails.password;
    var name = newJob.name;
    var positionType = newJob.positionType;
    var employmentType = newJob.employmentType;
    var field = newJob.field;
    var region = newJob.region;
    var country = newJob.country;
    var state = newJob.state;
    var city = newJob.city;
    var deadline = newJob.deadline;
    var salary = newJob.salary;
    var keywords = newJob.keywords;

    if(!name) {
      var nameStr = {};
    }
    else {
      nameStr = {$or: [{'name': name}, {'name': ""}]};
    }
    if(!positionType){
      var positionTypeStr = {};
    }
    else{
      var positionTypeStr = {$or: [{'positionType': positionType}, {'positionType': ""}]};
    }    
    if(!employmentType){
      var employmentTypeStr = {};
    }
    else{
      var employmentTypeStr = {$or: [{'employmentType': employmentType}, {'employmentType': ""}]};
    }
    if(!field){
        var fieldStr = {};
    }
    else{
        var fieldStr = {$or: [{'field': field}, {'field': ""}]};
    }
    if(keywords.length == 1 && !keywords[0]){
      var keywordsStr = {};
    }
    else{
      var keywordsStr = {$or: [{'keywords': {$in:keywords}}, {'keywords' : ""} ]};//or
      //var keywordsStr = {'keywords': {$all:keywords}};//and
    }
    if(!region){
      var regionStr = {};
    }
    else{
      var regionStr = {$or: [{'region' : region}, {'region': ""}, {'region': null}]};
    }   
    if(!country){
      var countryStr = {};
    }
    else{
      var countryStr = {$or: [{'country' : country}, {'country': ""}, {'country': null}]};
    }
    if(!state){
      var stateStr = {};
    }
    else{
      var stateStr = {$or: [{'state' : state}, {'state': ""}, {'state': null}]};
    }
    if(!city){
      var cityStr = {};
    }
    else{
      var cityStr = {$or: [{'city' : city}, {'city': ""}]};
    }
    if(!deadline){
        var deadlineStr = {};
    }
    else{
        var deadlineStr = {$or: [{'deadline': {$lte:deadline}}, {'deadline': ""}]};
    }
    if(!salary){
        var salaryStr = {};
    }
    else{
        var salaryStr = {$or: [{'salary': {$gte:salary}}, {'salary': ""}]};
    }
    SubsModel.find({$and: [nameStr, positionTypeStr, employmentTypeStr, fieldStr, regionStr, countryStr, stateStr, cityStr, deadlineStr, salaryStr, keywordsStr]}, function(err, results){
      console.log('user number' + results.length);

      var server  = email.server.connect({
        user:  adminEmail, 
        password: adminPw,
        host:  "smtp-mail.outlook.com", 
        tls: {ciphers: "SSLv3"}
      });
      results.forEach(function(result){

        var message = {
          text:  "Hello " + result.userName + ", \n There is a new job match your subscription. Below is the detailed information. \n" + 
          "Job name: " + name + "\n" + "Job type: " + type + "\n" + "Region: " + region + "\n" +
          "Country: " + country + "\n" + "State: " + state + "\n" + "City: " + city + "\n" + "Date: " +
          startDate + "~" + endDate + "\n" + "Abstract Deadline: " + deadline + "\n" + 
          "Description: " + description + "\n" + "keywords: " + keywords,
          from:  "you <jinhang91@hotmail.com>", 
          to:    "zhuyingcau <" + result.userEmail + ">",
          cc:    "",
          subject: "testing email js"
        };

        // send the message and get a callback with an error or details of the message that was sent
        server.send(message, function(err, message) { 
            console.log(err || message); 
        });
      });
    });
  });
}



module.exports = router;