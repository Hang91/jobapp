var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('eventapp', ['users','events','types','subs']);
var TypesModel = require('../models/TypeDB');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
//manage categories page - GET
router.get('/categories', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
	TypesModel.find({}, function(err, results){
		if(err){
			return next(err);
		}
		res.render('manage_categories', {title:'Manage Categories', user: req.user, results : results});
	});
	// var collection = db.collection('types');
	// collection.find({}).toArray(function(err, results){
	// 	res.render('manage_categories', { title:'Manage Categories', user: req.user, results : results}); 
	// });	
});

//add type
//use ajax post (use get cannot work)
router.get('/categories/add', function(req, res){
	var type = req.query.type;
    console.log(type);
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
router.get('/categories/edit',function(req, res){
    var id = req.query._id;
    var type = req.query.type;
    TypesModel.update({_id:id}, {$set:{type:type}},{}, function(err, movie){
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
router.get('/categories/delete', function(req, res){
	var id = req.query._id;
    console.log(id);
   //MogoDB use remove function to remove data
    TypesModel.remove({_id:id}, function (err) {
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
                    res.redirect("/manage/categories");
                    res.render('manage_categories', {title:'Manage Categories', user: req.user, results : results});
                }
            });
        }
    });
});

//manage categories page - GET
router.get('/events', ensureLoggedIn('/users/login'), isAdmin, function(req, res){
	var collection = db.collection('events');
	collection.find({approved : 0}).toArray(function(err, results1){
		res.render('manage_events', { title:'Manage Events', user: req.user, results1 : results1}); 
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