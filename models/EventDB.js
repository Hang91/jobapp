var mongoose = require('mongoose');

//events schema
var eventsSchema = mongoose.Schema({
		name: {
			type: String
		},
		type: {
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
		contact: {
			type: String
		},
		email: {
			type: String
		},
		website: {
			type: String
		},
		startDate: {
			type: Date
		},
		endDate: {
			type: Date
		},
		description: {
			type: String
		},
		keywords: {
			type: String
		},
		approved: {
			type: String
		}
});

var EventSchema = new mongoose.Schema({	
	name: String,
	email:  String,
	username: String,
	events: [{name: String,
			type:String,
			city : String,
			state: String,
			country: String,
			organization: String,
			contact:  String,
			email: String,
			website: String,
			startDate: Date,
			endDate: Date,
			description: String,
			keywords: String,
			approved: String,
		}],	
});



var EventDB = mongoose.model('EventDB', EventSchema);

module.exports = EventDB;
// module.exports.getEvents = function(callback,limit){
// 	EventDB.find(callback).limit(limit);
// }










