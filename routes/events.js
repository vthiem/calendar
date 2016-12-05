var express = require('express');
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
		that.model('events')
			.find({$or: [ //this.find != work
				{eventStart: {$lte: that.eventStart}, eventEnd: {$gt: that.eventStart}},
				{eventStart: {$lte: that.eventEnd}, eventEnd: {$gt: that.eventEnd}}
			]}
		)
			.then(function(events){
				resolve(events.length !== 0);
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
	var returnedData = {
		data: "",
	};

	eventModel.find(function(err, event){
		if(err){
			console.log(err);
		}else{
			returnedData.data = event;
			res.json(returnedData);
		}
	});
});

router.post('/', function(req, res, next){
	var newEvent = new eventModel(req.body);
	var returned = {
		data: "",
		error: null
	};

	newEvent.hasConflicts()
	.then(function(response){
		console.log(response);
		if(!response){
			newEvent.save(function(err, event){
				if(err){
					console.log(err);
				}else{
					returned.data = event;
				}
			});
		}
		else{
			//add to error object to inform user
			returned.error = "There is a collision";
		}
		res.json(returned);
	})
	.catch(function(err){
		console.log(err);
	});
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
