// var currentDate = new Date();
var currentMonthNum = currentDate.getMonth();
var currentDayNum = currentDate.getDate();
var currentWeekdayNum = currentDate.getDay();
var currentYearNum = currentDate.getFullYear();

var tempMonthNum = currentMonthNum;
var tempYearNum = currentYearNum;
var tempDayNum = currentDayNum;

var dateEvents = {
}

var events = new Array();
function Event(n, s, e, det, rep, repDays, id, sTime, eTime){
  this.name = n;
  this.startDate = s;
  this.endDate = e;
  this.details = det;
  this.repeat = rep;
  this.repeatDays = repDays;
  this.id = id;
  this.sTime = sTime;
  this.eTime = eTime
}

function checkDate(celldate){
  if(dateEvents.hasOwnProperty(celldate)){
    if(dateEvents[celldate].length>0){
      return true;
    }
  }
  return false;
}

var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekdays = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
var monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function repeatOption(){
  var repeat = document.querySelector("#repeatOptionButton");
  if(repeat.checked){
    document.querySelector("#repNone").disabled = false;
    document.querySelector("#repWeekly").disabled = false;
    document.querySelector("#repMonthly").disabled = false;
  }
  else{
    document.querySelector("#repNone").disabled = true;
    document.querySelector("#repWeekly").disabled = true;
    document.querySelector("#repMonthly").disabled = true;
  }
}

function resetWeekly(){
  var sun = document.querySelector("#Sun");
  var mon = document.querySelector("#Mon")
  var tue = document.querySelector("#Tue")
  var wed = document.querySelector("#Wed")
  var thu = document.querySelector("#Thu")
  var fri = document.querySelector("#Fri")
  var sat = document.querySelector("#Sat")
  if(sun.disabled === false){
    sun.disabled = true;
    sun.checked = false;
    mon.disabled = true;
    mon.checked = false;
    tue.disabled = true;
    tue.checked = false;
    wed.disabled = true;
    wed.checked = false;
    thu.disabled = true;
    thu.checked = false;
    fri.disabled = true;
    fri.checked = false;
    sat.disabled = true;
    sat.checked = false;
  }
}

function repWeeklyOptions(){
  var weekly = document.querySelector("#repWeekly");
  if(weekly.checked){
    document.querySelector("#Sun").disabled = false;
    document.querySelector("#Mon").disabled = false;
    document.querySelector("#Tue").disabled = false;
    document.querySelector("#Wed").disabled = false;
    document.querySelector("#Thu").disabled = false;
    document.querySelector("#Fri").disabled = false;
    document.querySelector("#Sat").disabled = false;
  }
}

function sortEvents(eventList, newEvent){
  var index = null;
  for(var i=0; i<eventList.length; i++){
    if(eventList[i].startDate > newEvent.startDate){ //FIX BY START TIME
      index = i;
      break;
    }
  }
  eventList.splice(index, 0, newEvent);
}

function addToDateEvents(eDate, eName, eStartDate, eEndDate, eDetails, eRepeatDuration, eRepeatDays, eID, sTime, eTime){
  var fullEvent = new Event(eName, eStartDate, eEndDate, eDetails, eRepeatDuration, eRepeatDays, eID, sTime, eTime);
  if(dateEvents.hasOwnProperty(eDate)){
    sortEvents(dateEvents[eDate], fullEvent);
  }
  else{
    dateEvents[eDate] = new Array();
    dateEvents[eDate].push(fullEvent);
  }
}

function postEvent(eStartDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, eRepeatDays, sTime, eTime){
  var eID = "";
  $.post(
    'http://localhost:3000/events',//"http://thiman.me:1337/vanessa",
    {
      eventName: eName,
      eventStart: eventStartDate,
      eventEnd: eventEndDate,
      eventDesc: eDetails,
      eventRepeat: eRepeatDuration,
      eventRepeatDays: eRepeatDays
    },
    function(data){
      var eInfo = $.parseJSON(data);
      if(eInfo.error===null){
        eID = eInfo.data._id;
        addToDateEvents(eStartDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, eRepeatDays, eID, sTime, eTime);
        setupCalendar(tempYearNum, tempMonthNum);
      }
      else{
        alert("POST ERROR: " + eInfo.error);
      }
    },
    'text'
  );
  return eID;
}

function formHandling(){
  var formData = new FormData(document.querySelector("#eventInputs"));
  cancelEdit();
  var eName = formData.get("eventName");

  var eStartDate = formData.get("eventStartDate");
  var eStartTime = formData.get("eventStartTime");
  var eventStartDate = new Date(eStartDate.toString() + "T" + eStartTime.toString());

  var eEndDate = formData.get("eventEndDate");
  var eEndTime = formData.get("eventEndTime");
  var eventEndDate = new Date(eEndDate.toString() + "T" + eEndTime.toString());
  var eDetails = formData.get("eventDetails");
  var eRepeatDuration = formData.get("repeat");
  var eRepeatDays = [formData.get("weeklySun"), formData.get("weeklyMon"), formData.get("weeklyTue"), formData.get("weeklyWed"), formData.get("weeklyThu"), formData.get("weeklyFri"), formData.get("weeklySat")];

  if(eStartDate === eEndDate){
    postEvent(eStartDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, eRepeatDays, eStartTime, eEndTime);
  }
  // else{
  //   var s = new Date(eStartDate);
  //   var e = new Date(eEndDate);
  //   if(s.getMonth() == e.getMonth()){
  //     var daysBetween = e.getDate()-s.getDate();
  //     var eID = postEvent(eStartDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, eRepeatDays, eStartTime, eEndTime);
  //     for(var i=2; i<=daysBetween+1; i++){
  //       var tempDay = new Date(s.getFullYear(), s.getMonth(), s.getDate()+i);
  //       var shortDate = createCellDateString(tempDay.getFullYear(), tempDay.getMonth(), tempDay.getDate());
  //       // alert(tempDay.toDateString());
  //       // postEvent(eStartDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, eRepeatDays);
  //       addToDateEvents(shortDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, eRepeatDays, eID, eStartTime, eEndTime);
  //     }
  //     setupCalendar(tempYearNum, tempMonthNum);
  //   }

  // }
  // $.post(
  //   'http://localhost:3000/events',//"http://thiman.me:1337/vanessa",
  //   {
  //     eventName: eName,
  //     eventStart: eventStartDate,
  //     eventEnd: eventEndDate,
  //     eventDesc: eDetails,
  //     eventRepeat: eRepeatDuration,
  //     eventRepeatDays: eRepeatDays
  //   },
  //   function(data){
  //     var eInfo = $.parseJSON(data);
  //     if(eInfo.temp === null){
  //       var eID = eInfo.data._id;
  //       addToDateEvents(eStartDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, eRepeatDays, eID);
  //       setupCalendar(tempYearNum, tempMonthNum);
  //     }
  //     else{
  //       alert("POST ERROR: " + eInfo.temp);
  //     }
  //   },
  //   'text'
  // );
}

function editpopup(){
  var edit = document.querySelector("#editpopup");
  if(document.getElementById("rightdrawer").style.zIndex === "3"){
    document.getElementById("rightdrawer").style.filter = "blur(1px)";
    edit.style.zIndex = "4";
  }
  else{
    edit.style.zIndex="2";
  }
  document.getElementById("weeklyPanel").style.filter = "blur(1px)";
  document.getElementById("monthlyview").style.filter = "blur(1px)";
  document.getElementById("addEvent").style.zIndex = "0";
  edit.style.display = "inline";
}

function cancelEdit(){
  var edit = document.querySelector("#editpopup");
  var sidepanel = document.querySelector("#rightdrawer");
  if(sidepanel.style.zIndex === "3"){
    sidepanel.style.filter = "none";
  }
  edit.style.zIndex="0";
  edit.style.display = "none";
  document.getElementById("weeklyPanel").style.filter = "none";
  document.getElementById("monthlyview").style.filter = "none";
  document.getElementById("addEvent").style.zIndex = "10";
  document.querySelector("#eventInputs").reset();
}

function getNextMonth(){
  if(tempMonthNum === 11){
    tempYearNum += 1;
    tempMonthNum = 0;
  }
  else{
    tempMonthNum += 1;
  }
  setupCalendar(tempYearNum, tempMonthNum);
}

function getPrevMonth(){
  if(tempMonthNum == 0){
    tempYearNum -= 1;
    tempMonthNum = 11;
  }
  else{
    tempMonthNum -= 1;
  }
  setupCalendar(tempYearNum, tempMonthNum);
}

function createCellDateString(yr, mth, day){
  if(day.toString().length ===1){
    return yr.toString() + "-" + (mth+1).toString() + "-0" + day.toString();
  }
  else{
    return yr.toString() + "-" + (mth+1).toString() + "-" + day.toString();
  }
}

function setupCalendar(yr, mth){
  var testing = document.getElementById("monthHeader");
  testing.innerHTML = months[mth] + " " + yr;

  var startWeekday = new Date(yr, mth, 1).getDay();
  var numDays = new Date(yr, mth+1, 0).getDate();
  var count=1;
  var started = false;

  var tbl = document.getElementById("monthDayClick");
  if(tbl != null){
    for(var i=2; i<tbl.rows.length; i++){
      for(var j=0; j<tbl.rows[i].cells.length; j++){
        var c = tbl.rows[i].cells[j];
        c.innerHTML = " ";
        c.style.color = "#909CD4";
        c.style.fontWeight = "normal";
        c.style.backgroundColor = "white";
      }
    }
    for(var i=2; i<tbl.rows.length; i++){
      for(var j=0; j<tbl.rows[i].cells.length; j++){
        if(yr===currentYearNum && mth===currentMonthNum){
          if(count===currentDayNum){
            tbl.rows[i].cells[j].style.color = "#5D9DB3";
            tbl.rows[i].cells[j].style.fontWeight = "bold";
          }
        }
        if(i===2 && !started && j===startWeekday){
            var cellDate = createCellDateString(tempYearNum, tempMonthNum, count);
            tbl.rows[i].cells[j].innerHTML = count;
            tbl.rows[i].cells[j].setAttribute("data-date", cellDate);
            started = true;
            count+= 1;
            if(checkDate(cellDate)){
              tbl.rows[i].cells[j].style.backgroundColor = "#AAD5E3";
            }
        }
        else if(count <= numDays && started){
          var cellDate = createCellDateString(tempYearNum, tempMonthNum, count);
          tbl.rows[i].cells[j].innerHTML = count;
          tbl.rows[i].cells[j].setAttribute("data-date", cellDate);
          count+=1;
          if(checkDate(cellDate)){
            tbl.rows[i].cells[j].style.backgroundColor = "#AAD5E3";
          }
        }
      }
    }
    for(var i=1; i<tbl.rows.length; i++){
      for(var j=0; j<tbl.rows[i].cells.length; j++){
        if(isNaN(parseInt(tbl.rows[i].cells[j].innerHTML))){
          tbl.rows[i].cells[j].style.cursor = "auto";
        }
      }
    }
  }
}

function weekViewToMonthView(){
  document.getElementById("monthlyview").style.display = "inline";
  document.getElementById("weeklyPanel").style.display = "inline";
  document.getElementById("weeklyview").style.display = "none";
  document.getElementById("monthViewButton").style.display = "none";
  var timeTable = document.querySelector("#weekTimeClick");
  for(var r=2; r<timeTable.rows.length; r++){
    for(var c=1; c<timeTable.rows[r].cells.length; c++){
      if(r===2){
        timeTable.rows[r].cells[c].style.backgroundColor = "#90a9d4";
      }
      else{
        timeTable.rows[r].cells[c].style.backgroundColor = "white";
        timeTable.rows[r].cells[c].style.cursor = "auto";
        timeTable.rows[r].cells[c].innerHTML = " ";
        if(timeTable.rows[r].cells[c].hasAttribute("onclick")){
          timeTable.rows[r].cells[c].removeAttribute("onclick");
        }
      }
    }
  }
}

function eventDetails(cell){
  var popup = document.querySelector("#eventdetailspopup");
  popup.style.display = "inline";
  popup.style.zIndex = 3;
  alert(cell.getAttribute("data-id"));
}

function hoursBetween(t1, t2){
  var h1 = t1.split(':');
  var h2 = t2.split(':');
  return parseInt(h2[0])-parseInt(h1[0]);
}

function getWeekView(cell){
  var rowNum = cell.rowIndex+2;
  var weekHeading = cell.cells[0].innerHTML;
  var dayArray = new Array();
  var firstDate = "";
  var first = false;
  var lastDate = "";
  var last = false;
  var spaceCount = 0;
  var temptbl = document.getElementById("monthDayClick");
  for(var i=0; i<temptbl.rows[rowNum].cells.length; i++){
    dayArray.push(temptbl.rows[rowNum].cells[i]);
    if(first===false){
      if(!isNaN(parseInt(temptbl.rows[rowNum].cells[i].innerHTML))){
        first = true;
        firstDate = temptbl.rows[rowNum].cells[i];
      }
      else{
        spaceCount += 1;
      }
    }
  }
  if(spaceCount === 7){
    return;
  }
  for(var i=temptbl.rows[rowNum].cells.length-1; i>=0; i--){
    if(last===false){
      if(!isNaN(parseInt(temptbl.rows[rowNum].cells[i].innerHTML))){
        last = true;
        lastDate = temptbl.rows[rowNum].cells[i];
      }
    }
  }

  var rowOfDates = document.querySelector("#weeklydates");
  var timeTable = document.querySelector("#weekTimeClick");
  for(var i=1; i<rowOfDates.cells.length; i++){
    rowOfDates.cells[i].innerHTML = dayArray[i-1].innerHTML;
    var dDate = dayArray[i-1].getAttribute("data-date");
    if(checkDate(dDate)){
      rowOfDates.cells[i].style.backgroundColor = "gray";
      for(var e=0; e<dateEvents[dDate].length; e++){
        var eventTemp = dateEvents[dDate][e];
        var start = eventTemp.sTime.substring(0,2) + ":00";
        var end = eventTemp.eTime.substring(0,2) + ":00";
        var eventStart = false;
        var startCell = null;
        var eventEnd = false;
        var hours = hoursBetween(eventTemp.sTime, eventTemp.eTime);
        var hoursCounted = 0;
        for(var t=3; t<timeTable.rows.length; t++){
          var dataTime = timeTable.rows[t].cells[i].getAttribute("data-time");
          timeTable.rows[t].cells[i].style.color = "gray";
          timeTable.rows[t].cells[i].style.fontSize = "14px";
          timeTable.rows[t].cells[i].style.textAlign = "center";
          timeTable.rows[t].cells[i].setAttribute("data-id", eventTemp.id);
          if(!eventStart && start===dataTime){
            timeTable.rows[t].cells[i].style.backgroundColor = "#AAD5E3";
            var pStart = document.createElement("p");
            pStart.innerHTML = eventTemp.sTime;
            timeTable.rows[t].cells[i].appendChild(pStart);
            if(hours <= 1){
              var pName = document.createElement("p");
              pName.innerHTML = eventTemp.name;
              timeTable.rows[t].cells[i].appendChild(pName);
              var pEnd = document.createElement("p");
              pEnd.innerHTML = eventTemp.eTime;
              timeTable.rows[t].cells[i].appendChild(pEnd);
            }
            else if(hours === 2){
              var pName = document.createElement("p");
              pName.innerHTML = eventTemp.name;
              timeTable.rows[t].cells[i].appendChild(pName);
            }
            else{
              hoursCounted += 2;
            }
            timeTable.rows[t].cells[i].setAttribute("onclick", "eventDetails(this)");
            timeTable.rows[t].cells[i].style.cursor = "pointer";
            eventStart = true;
            startCell = timeTable.rows[t].cells[i];
          }
          else if(eventStart && !eventEnd){
            if(end===dataTime){
              eventEnd = true;
              break;
            }
            if(hours===2){
              var pEnd = document.createElement("p");
              pEnd.innerHTML = eventTemp.eTime;
              timeTable.rows[t].cells[i].appendChild(pEnd);
            }
            else if(hoursCounted===2){
              var pName = document.createElement("p");
              pName.innerHTML = eventTemp.name;
              timeTable.rows[t].cells[i].appendChild(pName);
            }
            else if(hoursCounted === hours){
              var pEnd = document.createElement("p");
              pEnd.innerHTML = eventTemp.eTime;
              timeTable.rows[t].cells[i].appendChild(pEnd);
            }
            hoursCounted += 1;
            timeTable.rows[t].cells[i].style.backgroundColor = "#AAD5E3";
            timeTable.rows[t].cells[i].setAttribute("onclick", "null");
            timeTable.rows[t].cells[i].style.cursor = "pointer";
            timeTable.rows[t].cells[i].onclick = function(){
              eventDetails(startCell);
            };
          }
        }
      }
    }
  }

  document.getElementById("monthlyview").style.display = "none";
  document.getElementById("weeklyPanel").style.display = "none";
  document.getElementById("weeklyview").style.display = "inline";
  document.getElementById("monthViewButton").style.display = "inline";
  document.querySelector(".weekview th").innerHTML = weekHeading + ": " + months[tempMonthNum] + " " + firstDate.innerHTML + "-" + lastDate.innerHTML + " " + tempYearNum;
}

function deleteEvent(event){
  if(confirm("Do you want to delete the following event? \n\n     " + event.getAttribute("data-name"))){
    var dDate = event.getAttribute("data-date");
    // var dTime = event.getAttribute("data-time");
    // var dName = event.getAttribute("data-name");
    var dID = event.getAttribute("data-id");
    var tempArray = new Array();
    for(var i=0; i<dateEvents[dDate].length; i++){
      if(dID !== dateEvents[dDate][i].id){
        tempArray.push(dateEvents[dDate][i]);
      }
    }
    dateEvents[dDate] = tempArray;
    $.ajax({
      url: 'http://localhost:3000/events/' + dID, //'http://thiman.me:1337/vanessa/' + dID,
      type: 'DELETE',
      success: function(result){

      }
    });
    if(document.getElementById("rightdrawer").style.zIndex === "3"){
      var dl = document.querySelector("dl");
      var parent = dl.parentNode;
      var toRemove = new Array();
      for(var c=3; c<parent.childNodes.length; c++){
        var n = parent.childNodes[c].getAttribute("data-name");
        var t = parent.childNodes[c].getAttribute("data-time");
        if(n===dName && t===dTime){
          toRemove.push(parent.childNodes[c]);
        }
      }
      for(var r=0; r<toRemove.length; r++){
        parent.removeChild(toRemove[r]);
      }
    }
  }
  else{
    return;
  }
}

function SlideEventPanel(cell){
  if(!isNaN(parseInt(cell.innerHTML))){
    var dataDate = cell.getAttribute("data-date");
    var eventsOnDate = checkDate(dataDate);
    var dl = document.querySelector("dl");
    var parent = dl.parentNode;
    var removed = new Array();
    for(var i=3; i<parent.childNodes.length; i++){
      removed.push(parent.childNodes[i]);
    }
    for(var r=0; r<removed.length; r++){
      parent.removeChild(removed[r]);
    }
    if(document.getElementById("rightdrawer").style.zIndex === "3"){
      setupCalendar(tempYearNum, tempMonthNum);
      document.getElementById("addEvent").style.marginRight = "0px";
      document.getElementById("rightdrawer").style.width = "0px";
      document.getElementById("rightdrawer").style.zIndex="-1";
    }
    else{
      prevCell = cell;
      var color = "#90a9d4";
      if(eventsOnDate){
        color = "gray";
        for(var i=0; i<dateEvents[dataDate].length; i++){
          var ddTime = document.createElement("dd");
          ddTime.onclick = function(){
            alert("clicked");
          };
          ddTime.style.cursor = "pointer";
          var timeText = document.createTextNode(dateEvents[dataDate][i].sTime + " - " + dateEvents[dataDate][i].eTime + "  ");
          ddTime.appendChild(timeText);
          //ADDING DELETE BUTTON HERE FOR SIDEPANEL
          var delButton = document.createElement("button");
          delButton.style.cursor = "pointer";
          delButton.classname = "delEvent";
          delButton.setAttribute("data-name", dateEvents[dataDate][i].name);
          delButton.setAttribute("data-time", dateEvents[dataDate][i].sTime);
          delButton.setAttribute("data-date", dataDate);
          delButton.setAttribute("data-id", dateEvents[dataDate][i].id);
          delButton.style.marginLeft = "15px";
          delButton.onclick = function(){
            deleteEvent(this);
          };
          var delText = document.createTextNode("x");
          delButton.appendChild(delText);
          ddTime.setAttribute("data-name", dateEvents[dataDate][i].name);
          ddTime.setAttribute("data-time", dateEvents[dataDate][i].sTime);
          ddTime.setAttribute("data-id", dateEvents[dataDate][i].id);
          timeText.parentNode.className = "datetime";
          parent.insertBefore(delButton, null);
          parent.insertBefore(ddTime, null);
          var ddName = document.createElement("dd");
          ddName.onclick = function(){
            alert("clicked");
          }
          ddName.style.cursor = "pointer";
          var nameText = document.createTextNode(dateEvents[dataDate][i].name);
          ddName.appendChild(nameText);
          nameText.parentNode.className = "datetitle";
          ddName.setAttribute("data-name", dateEvents[dataDate][i].name);
          ddName.setAttribute("data-time", dateEvents[dataDate][i].sTime);
          ddName.setAttribute("data-id", dateEvents[dataDate][i].id);
          parent.insertBefore(ddName, null);
        }
      }
      cell.style.backgroundColor = color;
      cell.style.color = "white";
      document.getElementById("addEvent").style.marginRight = "105px";
      document.getElementById("drawerHeader").innerHTML = weekdays[cell.cellIndex] + ", " + monthsAbbr[tempMonthNum] + " " + cell.innerHTML + " " + tempYearNum;
      document.getElementById("rightdrawer").style.zIndex="3";
      document.getElementById("rightdrawer").style.width = "250px";
    }
  }
}

function loadEvents(){
  $.ajax({
    url: 'http://localhost:3000/events',//'http://thiman.me:1337/vanessa/',
    type: 'GET',
    dataType: 'text',
    success: function(data){
      var temp = $.parseJSON(data);
      for(var i=0; i<temp.data.length; i++){
        var eventAdd = temp.data[i];

        var eName = eventAdd.eventName;
        var eStartDate = eventAdd.eventStart;
        var eEndDate = eventAdd.eventEnd;
        var eDate = eStartDate.split('T')[0];
        var eDetails = eventAdd.eventDesc;
        var eRepeatDuration = eventAdd.eventRepeat;
        var eRepeatDays = [eventAdd["eventRepeatDays[0]"], eventAdd["eventRepeatDays[1]"], eventAdd["eventRepeatDays[2]"], eventAdd["eventRepeatDays[3]"], eventAdd["eventRepeatDays[4]"], eventAdd["eventRepeatDays[5]"], eventAdd["eventRepeatDays[6]"]];
        var eID = eventAdd._id;
        var sTime = eStartDate.split('T')[1].split('.')[0].substring(5,0);
        var eTime = eEndDate.split('T')[1].split('.')[0].substring(5,0);
        addToDateEvents(eDate, eName, eStartDate, eEndDate, eDetails, eRepeatDuration, eRepeatDays, eID, sTime, eTime);
      }
      setupCalendar(currentYearNum, currentMonthNum);
    },
    error: function(XMLHttpRequest, textStatus, error){
      alert(" Status: " + textStatus + " ErrorType: " + error);
    }
  });
}

var prevCell = null;
window.onload = function () {
  loadEvents();
 // setupCalendar(currentYearNum, currentMonthNum);
  var weekPanelTbl = document.getElementById("weeklyPanelClick");
  if(weekPanelTbl != null){
    for(var i=0; i<weekPanelTbl.rows.length; i++){
        weekPanelTbl.rows[i].onclick = function () {
          getWeekView(this);
        };
    }
  }

  var monthDaysTable = document.getElementById("monthDayClick");
  if(monthDaysTable != null){
    for(var i=2; i<monthDaysTable.rows.length; i++){
      for(var j=0; j<monthDaysTable.rows[i].cells.length; j++){
        monthDaysTable.rows[i].cells[j].onclick = function () {
          SlideEventPanel(this);
        };
      }
    }
  }
}

//NEED TO FIX WEEKLYPANELCLICK & SLIDEEVENTPANEL ON EVENT DAY CLICK
