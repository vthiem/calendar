var express = require('express');
var moment = require('moment');
var router = express.Router();

//localhost:3000/weekly?date=2016-11-14

/* GET monthly calendar page. */
router.get('/', function(req, res, next){
  var currentDate = moment();
  if(req.query.date){
    currentDate = moment(req.query.date);
  }

  var tempCurr = moment(currentDate);
  var testing = currentDate.weekday();
  var firstMonth = moment(currentDate.format('MMMM') + " 1, " + currentDate.format('YYYY'));
  var endWeek = tempCurr.endOf('week').weekday();
  var end = tempCurr.format('D');

  var week = Math.ceil(currentDate.endOf('week').date()/7);
  var start = currentDate.startOf('week').format('D');

  var diff = parseInt(end)-parseInt(start);
  var dayNums = [];
  var m = currentDate.format('MMMM');
  if(diff===6){
    for(var i=parseInt(start); i<=parseInt(end); i++){
      dayNums.push(i);
    }
  }
  else{
    if(parseInt(start)>parseInt(end)){
      start = firstMonth.format('D');
    }
    for(var i=parseInt(start); i<=parseInt(end); i++){
      dayNums.push(i);
    }
    for(var i=0; i<firstMonth.weekday(); i++){
      dayNums.unshift(" ");
    }
    if(dayNums.length < 7){
      for(var i=dayNums.length; i<7; i++){
        dayNums.push(" ");
      }
    }
  }

  m += " " + start + "-" + end + " ";
  res.render('calendar/weekly'
  ,{
    fullDate: currentDate.format('MMMM D, YYYY'),
    monthHeader: currentDate.format('MMMM YYYY'),
    currentDay: currentDate,
    weekNum: week,
    weekNumHeader: week + ": " + m + currentDate.format('YYYY'),
    dates: dayNums
  }
  );
})

module.exports = router;
