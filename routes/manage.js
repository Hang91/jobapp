var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('eventapp', ['users','events','types','subs']);
var TypesModel = require('../models/TypeDB');
var EventsModel = require('../models/EventDB');
var UsersModel = require('../models/UserDB');
var SubsModel = require('../models/SubDB');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var email   = require('emailjs/email');

var ObjectId = require('mongodb').ObjectID;


var json2csv = require('json2csv');
var fs = require('fs');

//manage users page - GET
router.get('/users', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var fields = ['userName', 'userEmail', 'name', 'type', 'city', 'state', 'country', 'region', 
        'organization', 'startDate', 'endDate', 'keywords'];
    //find all users sorted by priority
    UsersModel.find({priority : 0},function(err1, users1){//usrs
        if(err1){
            return next(err1);
        }
        //console.log(results1.length);
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
                res.render('manage_users', { title:'Manage | Manage Users', user: req.user, 
                    users1 : users1, users2 : users2, users3 : users3}); 
            }); 
        }); 
    }); 
});

//promote one user to manager
router.get('/users/promote', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var id = req.query.id;
    UsersModel.update({_id:ObjectId(id)}, {$set:{priority:1}}, function(err, user){//1 is manager
        if(err){
            res.send(err);
        }
        else {
            UsersModel.find({priority : 0},function(err, users1){
                if (err){ 
                    console.log("edit error!");
                    res.send({result:-1});
                }
                UsersModel.find({priority : 1},function(err, users2){
                    if (err){ 
                        console.log("edit error!");
                        res.send({result:-1});
                    }
                    UsersModel.find({priority : 3},function(err, users3){
                        if (err){ 
                            console.log("edit error!");
                            res.send({result:-1});
                        }
                        console.log("promote success!");
                        res.location('/manage/users');
                        res.redirect('/manage/users'); 
                    }); 
                }); 
            });
        }    
    });
});

//demote one manager to user
router.get('/users/demote', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var id = req.query.id;
    UsersModel.update({_id:ObjectId(id)}, {$set:{priority:0}}, function(err, user){//0 is user
        if(err){
            res.send(err);
        }
        else {
            UsersModel.find({priority : 0},function(err, users1){
                if (err){ 
                    console.log("edit error!");
                    res.send({result:-1});
                }
                UsersModel.find({priority : 1},function(err, users2){
                    if (err){ 
                        console.log("edit error!");
                        res.send({result:-1});
                    }
                    UsersModel.find({priority : 2},function(err, users3){
                        if (err){ 
                            console.log("edit error!");
                            res.send({result:-1});
                        }
                        console.log("demote success!");
                        res.location('/manage/users');
                        res.redirect('/manage/users'); 
                    }); 
                }); 
            });
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
        // res.render('index', { title:'Home', 
        //     user: req.user, 
        //     results3 : results}); 
    }); 
});

//manage events page - GET
router.get('/events', ensureLoggedIn('/users/login'), isManager, function(req, res){
    EventsModel.find({approved : 0},function(err1, results1){//to be approve
        if(err1){
            return next(err1);
        }
        //console.log(results1.length);
        EventsModel.find({approved : 1},function(err2, results2){//approve
            if(err2){
                return next(err2);
            }
            //console.log(results2.length);
            EventsModel.find({approved : 3},function(err3, results3){//revise
                if(err3){
                return next(err3);
            }
                //console.log(results3.length);
                res.render('manage_events', { title:'Manage | Manage Events', user: req.user, 
                    results1 : results1, results2 : results2, results3 : results3}); 
            }); 
        }); 
    }); 
});


//check detail of an event
router.get('/events/details', ensureLoggedIn('/users/login'), isManager, function(req, res){
    var id = req.query.id;
    //console.log(id);
    TypesModel.find({}, function(err, types){
        if(err){
            return next(err);
        }
        EventsModel.findById(id, function(err, event){
            if(err){
                res.send(err);
            }
            res.render('events_details', {title: 'Manage | Event Details', 
                user: req.user, types:types, event:event});
        });
    });
});

//edit & approve / disapprove / ask for revision
router.post('/events/details', ensureLoggedIn('/users/login'), isManager, function(req, res){
    if(req.body.manage_event_detail == "disapprove"){
            var id  = req.body.id;
            EventsModel.findByIdAndRemove(ObjectId(id), function(err, event){
                    if(err){
                        res.send(err);
                    }
                    else {
                        console.log("disapprove success!");
                        EventsModel.find({approved : 0},function(err, results1){//to be approve
                            if (err){ 
                                console.log("edit error!");
                                res.send({result:-1});
                            }
                            EventsModel.find({approved : 1},function(err, results2){//approve
                                if (err){ 
                                    console.log("edit error!");
                                    res.send({result:-1});
                                }
                                EventsModel.find({approved : 3},function(err, results3){//revise
                                    if (err){ 
                                        console.log("edit error!");
                                        res.send({result:-1});
                                    }
                                    //success msg
                                    //alertUser(newEvent);
                                    req.flash('success', 'Disapprove!');
                                    res.location('/manage/events');
                                    res.redirect('/manage/events');
                                }); 
                            }); 
                        });
                    }    
                });
    }
    //get form values
    var id        = req.body.id;
    var name        = req.body.name;
    var type        = req.body.type;
    var city    = req.body.city;
    var state   = req.body.state;
    var country     = req.body.country;
    var region      = req.body.region;
    var organization    = req.body.organization;
    var contact     = req.body.contact;
    var email   = req.body.email;
    var website     = req.body.website;
    var startDate   = req.body.startDate;
    var endDate = req.body.endDate;
    var deadline = req.body.deadline;
    var description = req.body.description;
    var comments = req.body.comments;
    if(typeof req.body.keywords == 'string') {
        var keywords    = req.body.keywords.split(",");
    } else {
        var keywords = null;
        console.log('keywords is not a string');
    }
    var userName = req.user.name;
    var userEmail = req.user.email;

    if(req.body.manage_event_detail == "revise"){
        
        var approved = 3;//0:not check yet; 1:approve; 2:disapprove; 3.ask for revision

        var newEvent = {
                   name: name,
                   type: type,
                   region: region,//continent
                   country: country,
                   state: state,
                   city: city,
                   organization: organization,
                   contact: contact,
                   email: email,
                   website: website,
                   startDate: startDate,
                   endDate: endDate,
                   deadline: deadline,
                   description: description,
                   keywords: keywords,
                   approved: approved,
                   comments: comments,
                   userName: userName,
                   userEmail: userEmail
            }
        //update
        EventsModel.update({_id:ObjectId(id)}, newEvent, function(err, doc){
        if(err){
            res.send(err);
        }
        else{
            console.log('ask for revision success!');
            //success msg
            //alertUser(newEvent);
            req.flash('success', 'Successfully ask for revision!');
            res.location('/manage/events');
            res.redirect('/manage/events');
        }
        });
    }
    else if(req.body.manage_event_detail == "approve"){
        var approved = 1;//0:not check yet; 1:approve; 2:disapprove; 3.ask for revision

        var newEvent = {
                   name: name,
                   type: type,
                   region: region,//continent
                   country: country,
                   state: state,
                   city: city,
                   organization: organization,
                   contact: contact,
                   email: email,
                   website: website,
                   startDate: startDate,
                   endDate: endDate,
                   deadline: deadline,
                   description: description,
                   keywords: keywords,
                   approved: approved,
                   comments: comments,
                   userName: userName,
                   userEmail: userEmail
            }
        //update
        EventsModel.update({_id:ObjectId(id)}, newEvent, function(err, doc){
        if(err){
            res.send(err);
        }
        else{
            console.log('approve success!');
            //success msg
            alertUser(newEvent);
            req.flash('success', 'Approve!');
            res.location('/manage/events');
            res.redirect('/manage/events');
        }
        });
    }
    
});

//approve an event
router.get('/events/approve', ensureLoggedIn('/users/login'), isManager, function(req, res){
    var id = req.query.id;
    //console.log("in the approve function， id="+id);
    EventsModel.update({_id:ObjectId(id)}, {$set:{approved:1}}, function(err, event){
        if(err){
            res.send(err);
        }
        else {
            EventsModel.find({approved : 0},function(err, results1){//to be approve
                if (err){ 
                    console.log("edit error!");
                    res.send({result:-1});
                }
                EventsModel.find({approved : 1},function(err, results2){//approve
                    if (err){ 
                        console.log("edit error!");
                        res.send({result:-1});
                    }
                    EventsModel.find({approved : 3},function(err, results3){//revise
                        if (err){ 
                            console.log("edit error!");
                            res.send({result:-1});
                        }
                        //email alert
                        EventsModel.findById(id, function(err, event){
                            alertUser(event);
                            console.log("approve success!");
                            res.location('/manage/events');
                            res.redirect('/manage/events');                            
                        });
                    }); 
                }); 
            });
        }    
    });
});

//disapprove an event - delete
router.get('/events/disapprove', ensureLoggedIn('/users/login'), isManager, function(req, res){
    var id = req.query.id;
    //console.log(id);
    EventsModel.findByIdAndRemove(ObjectId(id), function(err, event){
        if(err){
            res.send(err);
        }
        else {
            console.log("disapprove success!");
            EventsModel.find({approved : 0},function(err, results1){//to be approve
                if (err){ 
                    console.log("edit error!");
                    res.send({result:-1});
                }
                EventsModel.find({approved : 1},function(err, results2){//approve
                    if (err){ 
                        console.log("edit error!");
                        res.send({result:-1});
                    }
                    EventsModel.find({approved : 3},function(err, results3){//revise
                        if (err){ 
                            console.log("edit error!");
                            res.send({result:-1});
                        }
                        
                        res.location('/manage/events');
                        res.redirect('/manage/events');
                    }); 
                }); 
            });
        }    
    });
});

//manage categories page - GET
router.get('/categories', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
	TypesModel.find({}, function(err, results){
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
	var type = req.query.type;
   //MogoDB中可以用Create方法添加数据
    TypesModel.create({type:type}, function (err) {
        if (err) res.send({result:-1});
        else {
            TypesModel.find({}, function (error, results) {
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
    var type = req.query.type;
    TypesModel.update({_id:ObjectId(id)}, {$set:{type:type}},{}, function(err, next){
        if(err){
            res.send(err);
        }
        else {
            TypesModel.find({}, function (error, results) {
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
    TypesModel.findByIdAndRemove(ObjectId(id), function (err) {
        if (err){ 
            console.log("delete err!");
            res.send({result:-1});
        }
        else {
            TypesModel.find({}, function (error, results) {
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

function alertUser(newEvent) {
  var collection = db.collection('subs');
  var name = newEvent.name;
  var type = newEvent.type;
  var keywords = newEvent.keywords;
  var region = newEvent.region;
  var country = newEvent.country;
  var state = newEvent.state;
  var city = newEvent.city;
  var startDate = newEvent.startDate;
  var endDate = newEvent.endDate;

  //delete out-of-date subs
  // var today = new Date();
  // var dd = today.getDate();
  // var mm = today.getMonth()+1; //January is 0!
  // var yyyy = today.getFullYear();

  // if(dd<10) {
  //     dd = '0'+dd
  // } 

  // if(mm<10) {
  //     mm = '0'+mm
  // } 

  // today =  yyyy + '-' + mm + '-' + dd;
  // console.log(today);
  // collection.remove({'startDate': {$lt:today}})

  if(!name) {
    var nameStr = {};
  }
  else {
    nameStr = {$or: [{'name': name}, {'name': ""}]};
  }
  if(!type){
    var typeStr = {};
  }
  else{
    var typeStr = {$or: [{'type': type}, {'type': ""}]};
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
  if(!startDate){
    var startDateStr = {};
  }
  else{
    var startDateStr = {$or: [{'startDate': {$lte:startDate}}, {'startDate': ""}]};
  }
  if(!endDate){
    var endDateStr = {};
  }
  else{
    var endDateStr = {$or: [{'endDate' : {$gte:endDate}}, {'endDate': ""}]};
  }
  SubsModel.find({$and: [nameStr, typeStr, regionStr, countryStr, stateStr, cityStr, startDateStr, endDateStr, keywordsStr]}, function(err, results){
    console.log('user number' + results.length);

    var server  = email.server.connect({
      user:    "jinhang91@hotmail.com", 
      password:"891110Hotmail", 
      host:  "smtp-mail.outlook.com", 
      tls: {ciphers: "SSLv3"}
    });
    results.forEach(function(result){

      var message = {
        text:  "Hello " + result.userName + ", \n There is a new event match your subscription. Below is the detailed information. \n" + 
        "Event name: " + name + "\n" + "Event type: " + type + "\n",
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
}

module.exports = router;