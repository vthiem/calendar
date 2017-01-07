var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var eventSchema = new Schema({
	_creator: { type: String, ref: 'users'},
	eventName: String,
	eventStart: Date,
	eventEnd: Date,
	eventDesc: String,
	eventRepeat: String,
	eventRepeatDays: [String]
});

eventSchema.methods.hasConflicts = function(){
	var that = this;
	return new Promise(function(resolve, reject){
		that.model('events')
				.find({$or: [ //this.find != work
					{eventStart: {$lte: that.eventStart}, eventEnd: {$gt: that.eventStart}},
					{eventStart: {$lte: that.eventEnd}, eventEnd: {$gt: that.eventEnd}}
				], $and: [{_creator: {$eq: that._creator}}]}
			)
				.then(function(events){
					resolve(events.length !== 0);
				})
				.catch(function(err){
					reject(err);
				});
	});
};

var eventModel = mongoose.model('events', eventSchema);

var userSchema = new Schema({
	user: { type: String, unique: true},
	pass: String,
	events: [{type: Schema.Types.ObjectId, ref: 'events'}]
});

var userModel = mongoose.model('users', userSchema);

module.exports = {
  User: userModel,
	Events: eventModel
}
