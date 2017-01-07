var express = require('express');
var moment = require('moment');
var router = express.Router();

//localhost:3000/weekly?date=2016-11-14

/* GET monthly calendar page. */
router.get('/', function(req, res, next){
  // req.session.reset();
  if(req.session && req.session.user){
    var currentDate = moment();
    if(req.query.date){
      currentDate = moment(req.query.date);
    }

    var getEnd = moment(currentDate);
    var week = Math.ceil(getEnd.endOf('week').date()/7);

    var start = null;
    var end = null;
    var m = currentDate.format('MMMM');

    var dTemp = currentDate.weekday();
    var testing = [];
    var testingDates = [];
    var date = moment(currentDate);

    var tempMth = currentDate.month();
    var tempDay = date.subtract(dTemp, 'days');
    if(tempDay.month()===tempMth){
      testing.push(tempDay.date());
      testingDates.push(tempDay.format('YYYY-MM-DD'));
    }
    else{
      testing.push(" ");
      testingDates.push(" ");
    }
    for(var i=1; i<7; i++){
      var temp = date.add(1, 'days');
      if(temp.month()===tempMth){
        testing.push(tempDay.date());
        testingDates.push(tempDay.format('YYYY-MM-DD'));
      }
      else{
        testing.push(" ");
        testingDates.push(" ");
      }
    }

    for(var i=0; i<testing.length; i++){
      if(!isNaN(parseInt(testing[i]))){
        start = testing[i];
        break;
      }
    }
    for(var i=testing.length-1; i>=0; i--){
      if(!isNaN(parseInt(testing[i]))){
        end = testing[i];
        break;
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
      dates: testing,
      shortDates: testingDates,
      linkMonth: "http://localhost:3000/calendar?date=" + moment(req.query.date).format('YYYY-MM-DD'),
      linktologout: "http://localhost:3000/logout"
    }
    );
  }
  else{
    res.redirect('/');
  }
})

module.exports = router;
