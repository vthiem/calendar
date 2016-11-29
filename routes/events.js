var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventSchema = new Schema({
	eventName: String,
	eventStart: String,
	eventEnd: String,
	eventDate: Date,
	eventDesc: String,
	eventRepeat: String,
	eventRepeatDays: Array
});
var eventModel = mongoose.model('event', eventSchema);

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
	eventModel.find(function(err, event){
		if(err){
			console.log(err);
		}else{
			res.json(event);
		}
	});
});

router.post('/', function(req, res, next){
	var newEvent = new eventModel(req.body);

	newEvent.save(function(err, event){
		if(err){
			console.log(err);
		}else{
			res.json(event);
		}
	});
});

router.patch('/:id', function(req, res, next){
	eventModel.findByIdAndUpdate(req.params["id"], req.body, function(error, event){
		if(err){
			console.log(err);
		}else{
			res.json(event);
		}
	});
});

module.exports = router;
