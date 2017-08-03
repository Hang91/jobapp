var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('eventapp', ['users','events','types','subs']);
var TypesModel = require('../models/TypeDB');
var EventsModel = require('../models/EventDB');
var SubsModel = require('../models/SubDB');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var ObjectId = require('mongodb').ObjectID;


var json2csv = require('json2csv');
var fs = require('fs');


//manage subscription page - GET - download using json2csv
router.get('/users', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
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
            res.location('/');
            res.redirect('/');
        });
        // res.render('index', { title:'Home', 
        //     user: req.user, 
        //     results3 : results}); 
    }); 
});

//manage events page - GET
router.get('/events', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
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
router.get('/events/details', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
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
router.post('/events/details', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
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
            //alertUser(newEvent);
            req.flash('success', 'Approve!');
            res.location('/manage/events');
            res.redirect('/manage/events');
        }
        });
    }
    
});

//approve an event
router.get('/events/approve', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var id = req.query.id;
    console.log("in the approve function， id="+id);
    EventsModel.update({_id:ObjectId(id)}, {$set:{approved:1}}, function(err, movie){
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
                        console.log("approve success!");
                        res.location('/manage/events');
                        res.redirect('/manage/events');
                    }); 
                }); 
            });
        }    
    });
});

//disapprove an event - delete
router.get('/events/disapprove', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
    var id = req.query.id;
    console.log(id);
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
    console.log("edit type:"+id);
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
    console.log("delete type:"+id);
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

	 if ((!req.isAuthenticated()) || (req.user.name != 'admin')) {
	 	req.flash('error', 'Seems like you aren\'t an admin! '+req.user.name);
		res.redirect('/');
	 }
	 else{
	 	next();
	 }
};

module.exports = router;