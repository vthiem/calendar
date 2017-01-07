var express = require('express');
var moment = require('moment');
var router = express.Router();

//localhost:3000/?date=2016-11-14

/* GET monthly calendar page. */
router.get('/', function(req, res, next){
  // req.session.reset();
  if(req.session && req.session.user){
    var currentDate = moment();
    if(req.query.date){
      currentDate = moment(req.query.date);
    }

    var link = "http://localhost:3000/weekly?date=";
    var firstDay = moment(currentDate.format('MMMM') + " 1, " + currentDate.format('YYYY'));
    var week1 = firstDay.format('YYYY-MM-DD');
    var week1Link = link + week1;
    var week2 = firstDay.add(1, 'weeks').startOf('week').format('YYYY-MM-DD');
    var week2Link = link + week2;
    var week3 = firstDay.add(1, 'weeks').startOf('week').format('YYYY-MM-DD');
    var week3Link = link + week3;
    var week4 = firstDay.add(1, 'weeks').startOf('week').format('YYYY-MM-DD');
    var week4Link = link + week4;
    var week5 = firstDay.add(1, 'weeks').startOf('week').format('YYYY-MM-DD');
    var week5Link = link + week5;
    var week6 = firstDay.add(1, 'weeks').startOf('week').format('YYYY-MM-DD');
    var week6Link = link + week6;

    // if(parseInt(moment(week1).format('D'))>parseInt(moment(week2).format('D'))){
    //   week1 = currentDate;
    //   week1Link = "http://localhost:3000/?date=" + currentDate.format('YYYY-MM-DD');
    // }
    if(parseInt(moment(week6).format('D'))<parseInt(moment(week5).format('D'))){
      week6 = currentDate;
      week6Link = "http://localhost:3000/calendar?date=" + currentDate.format('YYYY-MM-DD');
    }

    var calLink = "http://localhost:3000/calendar?date=";
    var previous = calLink + moment(currentDate.format('YYYY') + '-' + currentDate.format('MM') + "-01").subtract(1, 'months').format('YYYY-MM-DD');
    var next = calLink + moment(currentDate.format('YYYY') + '-' + currentDate.format('MM') + "-01").add(1, 'months').format('YYYY-MM-DD');

    res.render('calendar/monthly'
    ,{
      fullDate: currentDate.format('MMMM D, YYYY'),
      monthHeader: currentDate.format('MMMM YYYY'),
      currentDay: currentDate,
      linkWeekly: week1Link,
      linkWeekly2: week2Link,
      linkWeekly3: week3Link,
      linkWeekly4: week4Link,
      linkWeekly5: week5Link,
      linkWeekly6: week6Link,
      prevMonth:  previous,
      nextMonth: next
    }
    );
  }
  else{
    res.redirect('/');
  }
})

module.exports = router;
