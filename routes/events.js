var express = require('express');
var router = express.Router();

var eventModel = require("../public/models/models").Events;

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

	eventModel.find({ _creator: req.session.user}).exec(function(err, event){
		if(err){
			console.log(err);
		}else{
			returnedData.data = event;
			res.json(returnedData);
		}
	});
});

router.post('/', function(req, res, next){
	// var newEvent = new eventModel(req.body);
	var newEvent = new eventModel({
		eventName: req.body.eventName,
		eventStart: req.body.eventStart,
		eventEnd: req.body.eventEnd,
		eventDesc: req.body.eventDesc,
		eventRepeat: req.body.eventRepeat,
		eventRepeatDays: req.body.eventRepeatDays,
		_creator: req.session.user
	});

	var returned = {
		data: null,
		error: null
	};

	newEvent.hasConflicts()
	.then(function(response){
		if(!response){
			newEvent.save(function(err, event){
				if(err){
					console.log(err);
				}else{
					returned.data = event;
					res.json(returned);
				}
			});
		}
		else{
			//add to error object to inform user
			returned.error = "There is a date collision with a previously created event.";
			res.json(returned);
		}
	})
	.catch(function(err){
		console.log(err);
	});
});

router.patch('/:id', function(req, res, next){
	var returned = {
		data: null,
		error: null
	}

	// eventModel.findById(req.params["id"], function(err, found){
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		res.json(found);
	// 	}
	// })

	eventModel.findById(req.params["id"], req.body, {new: true}, function(err, updEvent){
		if(err){
			console.log(err);
		}
		else{
			//check for collisions on an update
			// returned.data = event;
			// res.json(returned);
			updEvent.hasConflicts()
			.then(function(response){
				if(!response){
					eventModel.findByIdAndUpdate(req.params["id"], req.body, {new: true}, function(err, event){
						if(err){
							console.log(err);
						}
						else{
							returned.data = event;
							res.json(returned);
						}
					});
				}
				else{
					//add to error object to inform user
					returned.error = "There is a date collision with a previously created event.";
					res.json(returned);
				}
			})
			.catch(function(err){
				console.log(err);
			});
		}
	});
});

module.exports = router;
