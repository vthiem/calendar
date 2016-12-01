var express = require('express');
var moment = require('moment');
var router = express.Router();

//localhost:3000/?date=2016-11-14

/* GET monthly calendar page. */
router.get('/', function(req, res, next){
  var currentDate = moment();
  if(req.query.date){
    currentDate = moment(req.query.date);
  }
  res.render('calendar/monthly'
  ,{
    fullDate: currentDate.format('MMMM D, YYYY'),
    monthHeader: currentDate.format('MMMM YYYY'),
    currentDay: currentDate
  }
  );
})

module.exports = router;
