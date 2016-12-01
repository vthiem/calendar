var express = require('express');
//var eventModel = require('../models/events');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventSchema = new Schema({
	eventName: String,
	eventStart: Date,
	eventEnd: Date,
	eventDesc: String,
	eventRepeat: String,
	eventRepeatDays: Array
});


eventSchema.methods.hasConflicts = function(){
	var that = this;
	return new Promise(function(resolve, reject){
		// resolve('good job');
		//reject('neg');
		that.model('events')
			.find({$or: [ //this.find != work
				{eventStart: {$lte: that.eventStart}, eventEnd: {$gt: that.eventStart}},
				{eventStart: {$lte: that.eventEnd}, eventEnd: {$gt: that.eventEnd}}
			]})
			.then(function(err, events){
				resolve((events.length !== 0));
			})
			.catch(function(err){
				reject(err);
			});
	});
};


eventSchema.methods.testing = function(){
	return "works";
}

var eventModel = mongoose.model('events', eventSchema);

var testing = {
	data: "",
	error: null
};

// newEvent.hasConflicts()
// .then(function(response){
// 	console.log(response);
	// if(!response){
	// 	//save
	// }
	// else{
	// 	//add to error object to inform user
	// }
// })
// .catch(function(err){
// 	console.log(err);
// });
// res.end();

router.delete('/:id', function(req, res, next){
	eventModel.findByIdAndRemove(req.params["id"], function(err, found){
		if(err){
			console.log(err);
		}else{
			res.json(found);
		}
	})
})

router.get('/', function(req, res, next){
	// res.send("hello");
	eventModel.find(function(err, event){
		if(err){
			console.log(err);
		}else{
			testing.data = event;
			res.json(testing);
		}
	});
});

router.post('/', function(req, res, next){
	var newEvent = new eventModel(req.body);

	newEvent.hasConflicts()
	.then(function(response){
		console.log(response);
		if(!response){
			newEvent.save(function(err, event){
				if(err){
					console.log(err);
				}else{
					testing.data = event;
					res.json(testing);
				}
			});
		}
		else{
			//add to error object to inform user
			testing.error = "There is a collision";
			res.json(testing);
		}
	})
	.catch(function(err){
		console.log(err);
	});
	res.end();


});

router.patch('/:id', function(req, res, next){
	eventModel.findByIdAndUpdate(req.params["id"], req.body, {new: true}, function(err, event){
		if(err){
			console.log(err);
		}
		else{
			//check for collisions on an update
			testing.data = event;
			res.json(testing);
		}
	});
});

module.exports = router;
