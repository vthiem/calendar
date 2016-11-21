var currentDate = new Date();
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
function Event(n, s, e, d, det, rep, repDays){
  this.name = n;
  this.start = s;
  this.end = e;
  this.date = d;
  this.details = det;
  this.repeat = rep;
  this.repeatDays = repDays;
}

function checkDate(celldate){
  if(dateEvents.hasOwnProperty(celldate)){
    return true;
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

function formHandling(){
  var formData = new FormData(document.querySelector("#eventInputs"));
  cancelEdit();
  var eName = formData.get("eventName");
  var eStartTime = formData.get("eventStartTime");
  var eEndTime = formData.get("eventEndTime");
  var eDate = formData.get("eventDate");
  var eDetails = formData.get("eventDetails");
  var eRepeatDuration = formData.get("repeat");
  var eRepeatDays = [formData.get("weeklySun"), formData.get("weeklyMon"), formData.get("weeklyTue"), formData.get("weeklyWed"), formData.get("weeklyThu"), formData.get("weeklyFri"), formData.get("weeklySat")];

  var fullEvent = new Event(eName, eStartTime, eEndTime, eDate, eDetails, eRepeatDuration, eRepeatDays);
  if(dateEvents.hasOwnProperty(eDate)){
    dateEvents[eDate].push(fullEvent);
  }
  else{
    dateEvents[eDate] = new Array();
    dateEvents[eDate].push(fullEvent);
  }
  setupCalendar(tempYearNum, tempMonthNum);
}

function editpopup(){
  if(document.getElementById("rightdrawer").style.zIndex === "3"){
    document.getElementById("rightdrawer").style.filter = "blur(1px)";
    document.getElementById("editpopup").style.zIndex = "4";
  }
  else{
    document.getElementById("editpopup").style.zIndex="2";
  }
  document.getElementById("weeklyPanel").style.filter = "blur(1px)";
  document.getElementById("monthlyview").style.filter = "blur(1px)";
  document.getElementById("addEvent").style.zIndex = "0";
}

function cancelEdit(){
  if(document.getElementById("rightdrawer").style.zIndex === "3"){
    document.getElementById("rightdrawer").style.filter = "none";
  }
  document.getElementById("editpopup").style.zIndex="0";
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
        tbl.rows[i].cells[j].innerHTML = " ";
        tbl.rows[i].cells[j].style.color = "#909CD4";
        tbl.rows[i].cells[j].style.fontWeight = "normal";
        tbl.rows[i].cells[j].style.backgroundColor = "white";
      }
    }
    for(var i=2; i<tbl.rows.length; i++){
      for(var j=0; j<tbl.rows[i].cells.length; j++){
        var eventNames = "";
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

var prevCell = null;
window.onload = function () {
 setupCalendar(currentYearNum, currentMonthNum);
  var weekPanelTbl = document.getElementById("weeklyPanelClick");
  if(weekPanelTbl != null){
    for(var i=0; i<weekPanelTbl.rows.length; i++){
        weekPanelTbl.rows[i].onclick = function () {
          getWeekView(this);
        };
    }
  }

  var tbl = document.getElementById("monthDayClick");
  if(tbl != null){
    for(var i=2; i<tbl.rows.length; i++){
      for(var j=0; j<tbl.rows[i].cells.length; j++){
        tbl.rows[i].cells[j].onclick = function () {
          SlideEventPanel(this);
        };
      }
    }
  }

  function getWeekView(cell){
    var rowNum = cell.rowIndex+2;
    var weekHeading = cell.cells[0].innerHTML;
    var dayArray = new Array();
    var firstDate = "";
    var first = false;
    var lastDate = "";
    var last = false;
    var temptbl = document.getElementById("monthDayClick");
    for(var i=0; i<temptbl.rows[rowNum].cells.length; i++){
      dayArray.push(temptbl.rows[rowNum].cells[i].innerHTML);
      if(first===false){
        if(!isNaN(parseInt(temptbl.rows[rowNum].cells[i].innerHTML))){
          first = true;
          firstDate = temptbl.rows[rowNum].cells[i].innerHTML;
        }
      }
    }
    for(var i=temptbl.rows[rowNum].cells.length-1; i>=0; i--){
      if(last===false){
        if(!isNaN(parseInt(temptbl.rows[rowNum].cells[i].innerHTML))){
          last = true;
          lastDate = temptbl.rows[rowNum].cells[i].innerHTML; //
        }
      }
    }

    var rowOfDates = document.querySelector("#weeklydates");
    for(var i=1; i<rowOfDates.cells.length; i++){
      rowOfDates.cells[i].innerHTML = dayArray[i-1];
    }

    document.getElementById("monthlyview").style.display = "none";
    document.getElementById("weeklyPanel").style.display = "none";
    document.getElementById("weeklyview").style.display = "inline";
    document.querySelector(".weekview th").innerHTML = weekHeading + ": " + months[tempMonthNum] + " " + firstDate + "-" + lastDate + " " + tempYearNum;
  }

  function SlideEventPanel(cell){
    if(!isNaN(parseInt(cell.innerHTML))){
      var dataDate = cell.getAttribute("data-date");
      var eventsOnDate = checkDate(dataDate);
      var dl = document.querySelector("dl");
      var parent = dl.parentNode;
      if(document.getElementById("rightdrawer").style.zIndex === "3"){
        prevCell.style.color= "#90a9d4";
        var color = "white";
        if(eventsOnDate){
          color = "#AAD5E3"
          for(var i=0; i<dateEvents[dataDate].length*2; i++){
            parent.removeChild(parent.lastChild);
          }
        }
        prevCell.style.backgroundColor=color;
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
            var timeText = document.createTextNode(dateEvents[dataDate][i].start + " - " + dateEvents[dataDate][i].end);
            ddTime.appendChild(timeText);
            timeText.parentNode.className = "datetime";
            parent.insertBefore(ddTime, null);

            var ddName = document.createElement("dd")
            var nameText = document.createTextNode(dateEvents[dataDate][i].name);
            ddName.appendChild(nameText);
            nameText.parentNode.className = "datetitle";
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
}
