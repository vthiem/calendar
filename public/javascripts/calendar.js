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
  var index = eventList.length;
  for(var i=0; i<eventList.length; i++){
    if(eventList[i].sTime > newEvent.sTime){
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

function postEvent(eStartDate, eEndDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, eRepeatDays, sTime, eTime){
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
      var temp = $.parseJSON(data);
      if(temp.error===null){
        var eventAdd = temp.data;
        var eName = eventAdd.eventName;
        var eStartDate = eventAdd.eventStart;
        var eEndDate = eventAdd.eventEnd;
        var eDate = eStartDate.split('T')[0];
        var eDetails = eventAdd.eventDesc;
        var eRepeatDuration = eventAdd.eventRepeat;
        var eRepeatDays = [eventAdd["eventRepeatDays[0]"], eventAdd["eventRepeatDays[1]"], eventAdd["eventRepeatDays[2]"], eventAdd["eventRepeatDays[3]"], eventAdd["eventRepeatDays[4]"], eventAdd["eventRepeatDays[5]"], eventAdd["eventRepeatDays[6]"]];
        eID = eventAdd._id;
        var sTime = eStartDate.split('T')[1].split('.')[0].substring(5,0);
        var eTime = eEndDate.split('T')[1].split('.')[0].substring(5,0);
        addToDateEvents(eDate, eName, eStartDate, eEndDate, eDetails, eRepeatDuration, eRepeatDays, eID, sTime, eTime);
        cancelEdit();
        if(document.getElementById("rightdrawer").style.zIndex === "3"){
          setupCalendar(tempYearNum, tempMonthNum);
          document.getElementById("addEvent").style.marginRight = "0px";
          document.getElementById("rightdrawer").style.width = "0px";
          document.getElementById("rightdrawer").style.zIndex="-1";
        }
        setupCalendar(tempYearNum, tempMonthNum);
      }
      else{
        alert(temp.error + " Please review the event edit information.");
      }
    },
    'text'
  );
  if(checkDate(eStartDate)){
    var found = false;
    for(var i=0; i<dateEvents[eStartDate].length; i++){
      var e = dateEvents[eStartDate][i];
      if(e.name === eName && e.sTime === sTime && e.eTime === eTime && e.details === eDetails){
        found = true;
      }
    }
    if(!found){
      var inputs = [eName, eStartDate, sTime, eEndDate, eTime, eDetails];
      return updFromForm(inputs);
    }
  }
  return eID;
}

function updFromForm(inputs){
  var formObj = document.forms['eventInputs'];
  formObj.elements["eventName"].value = inputs[0];
  formObj.elements["eventStartDate"].value = inputs[1];
  formObj.elements["eventStartTime"].value = inputs[2];
  formObj.elements["eventEndDate"].value = inputs[3];
  formObj.elements["eventEndTime"].value = inputs[4];
  formObj.elements["eventDetails"].value = inputs[5];
  editpopup();
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
    var repoptions = new Array();
    for(var i=0; i<eRepeatDays.length; i++){
      var r = eRepeatDays[i];
      if(r === null){
        repoptions.push(" ");
      }
      else{
        repoptions.push(eRepeatDays[i]);
      }
    }
    if(eStartDate === eEndDate){
      postEvent(eStartDate, eEndDate, eName, eventStartDate, eventEndDate, eDetails, eRepeatDuration, repoptions, eStartTime, eEndTime);
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

function createCellDateString(yr, mth, day){
  var date = yr.toString();
  if(day.toString().length ===1){
    if(mth.toString().length === 1){
      date += "-0" + (mth+1).toString() + "-0" + day.toString();
    }
    else{
      date += "-" + (mth+1).toString() + "-0" + day.toString();
    }
  }
  else{
    if(mth.toString().length === 1){
      date += "-0" + (mth+1).toString() + "-" + day.toString();
    }
    else{
      date += "-" + (mth+1).toString() + "-" + day.toString();
    }
  }
  return date;
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

function cancelEventDetails(){
  var popup = document.querySelector("#eventdetailspopup");
  popup.style.display = "none";
  popup.style.zIndex = 0;
  document.querySelector("#detailsName").innerHTML = "";
  document.querySelector("#detailsSDate").innerHTML = "";
  document.querySelector("#detailsSSTime").innerHTML = "";
  document.querySelector("#detailsEDate").innerHTML = "";
  document.querySelector("#detailsEETime").innerHTML = "";
  document.querySelector("#detailsDetails").innerHTML = "";
  document.querySelector("#detailsRepeat").innerHTML = "";
}

function eventDetails(cell){
  var popup = document.querySelector("#eventdetailspopup");
  popup.style.display = "inline";
  popup.style.zIndex = 3;
  var id = cell.getAttribute("data-id");
  var date = cell.getAttribute("data-date");
  var eFound = null;
  for(var i=0; i<dateEvents[date].length; i++){
    if(dateEvents[date][i].id === id){
      eFound = dateEvents[date][i];
    }
  }
  document.querySelector("#detailsName").innerHTML = eFound.name;
  document.querySelector("#detailsSDate").innerHTML = eFound.startDate.split('T')[0];
  document.querySelector("#detailsSSTime").innerHTML = eFound.sTime;
  document.querySelector("#detailsEDate").innerHTML = eFound.endDate.split('T')[0];
  document.querySelector("#detailsEETime").innerHTML = eFound.eTime;
  document.querySelector("#detailsDetails").innerHTML = eFound.details;
  document.querySelector("#detailsRepeat").innerHTML = eFound.repeat;
}

function deleteEvent(event){
  if(confirm("Do you want to delete the following event? \n\n     " + event.getAttribute("data-name"))){
    var dDate = event.getAttribute("data-date");
    var dTime = event.getAttribute("data-time");
    var dName = event.getAttribute("data-name");
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

function updateHandling(){
  var id = document.querySelector("#updateevent").getAttribute("data-id");
  var formData = new FormData(document.querySelector("#updateInputs"));
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
  var repoptions = new Array();
  for(var i=0; i<eRepeatDays.length; i++){
    var r = eRepeatDays[i];
    if(r === null){
      repoptions.push(" ");
    }
    else{
      repoptions.push(eRepeatDays[i]);
    }
  }
  cancelUpdate();
  //PATCH REQUEST & UPDATE DATA STRUCTURE VALUES
  $.ajax({
    url: 'http://localhost:3000/events/' + id,//'http://thiman.me:1337/vanessa/',
    type: 'PATCH',
    data: {
      eventName: eName,
      //NEED TO FIX W DATE
      // eventStart: eventStartDate,
      // eventEnd: eventEndDate,
      eventDesc: eDetails,
      eventRepeat: eRepeatDuration,
      eventRepeatDays: repoptions
    },
    // contentType: 'application/json',
    dataType: 'text',
    success: function(data){
      var temp = $.parseJSON(data);
        var eventAdd = temp.data;

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
        var dDate = eStartDate.split('T')[0];

        var tempArray = new Array();
        for(var i=0; i<dateEvents[dDate].length; i++){
          if(eID !== dateEvents[dDate][i].id){
            tempArray.push(dateEvents[dDate][i]);
          }
        }
        dateEvents[dDate] = tempArray;

      addToDateEvents(eDate, eName, eStartDate, eEndDate, eDetails, eRepeatDuration, eRepeatDays, eID, sTime, eTime);
      SlideEventPanel(clickedPanelCell);
      setupCalendar(currentYearNum, currentMonthNum);
      alert("Event " + eName + " on " + dDate + " has been updated.");
    },
    error: function(XMLHttpRequest, textStatus, error){
      alert(" Status: " + textStatus + " ErrorType: " + error);
    }
  });
}

function cancelUpdate(){
  var form = document.querySelector("#updateevent");
  if(document.getElementById("rightdrawer").style.zIndex === "3"){
    document.getElementById("rightdrawer").style.filter = "blur(0px)";
  }
  document.getElementById("weeklyPanel").style.filter = "blur(0px)";
  document.getElementById("monthlyview").style.filter = "blur(0px)";
  document.querySelector("#addEvent").style.display = "inline";
  form.style.display = "none";
  form.style.zIndex = "0";
  document.querySelector("#updateInputs").reset();
}

function updEvent(input){
  var id = input.getAttribute("data-id");
  var date = input.getAttribute("data-date");
  document.querySelector("#updateevent").style.display = "inline";
  document.querySelector("#updateevent").style.zIndex = "5";
  if(document.getElementById("rightdrawer").style.zIndex === "3"){
    document.getElementById("rightdrawer").style.filter = "blur(1px)";
  }
  document.getElementById("weeklyPanel").style.filter = "blur(1px)";
  document.getElementById("monthlyview").style.filter = "blur(1px)";
  document.querySelector("#addEvent").style.display = "none";
  var e = null;
  var found = false;
  for(var i=0; i<dateEvents[date].length; i++){
    if(dateEvents[date][i].id === id){
      e = dateEvents[date][i];
      found = true;
      break;
    }
  }
  if(found){
    var formObj = document.forms['updateInputs'];
    formObj.elements["eventName"].value = e.name;
    formObj.elements["eventStartDate"].value = e.startDate.split('T')[0];
    formObj.elements["eventStartTime"].value = e.sTime;
    formObj.elements["eventEndDate"].value = e.endDate.split('T')[0];
    formObj.elements["eventEndTime"].value = e.eTime;
    formObj.elements["eventDetails"].value = e.details;
    document.querySelector("#updateevent").setAttribute("data-id", id);
  }
}

var clickedPanelCell = null;
function SlideEventPanel(cell){
  clickedPanelCell = cell;
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

          var updButton = document.createElement("button");
          updButton.style.cursor = "pointer";
          updButton.classname = "delEvent";
          updButton.setAttribute("data-name", dateEvents[dataDate][i].name);
          updButton.setAttribute("data-time", dateEvents[dataDate][i].sTime);
          updButton.setAttribute("data-date", dataDate);
          updButton.setAttribute("data-id", dateEvents[dataDate][i].id);
          updButton.style.marginLeft = "5px";
          updButton.style.marginTop = "5px";
          updButton.onclick = function(){
            updEvent(this);
          };
          var updText = document.createTextNode("update");
          updButton.appendChild(updText);

          ddTime.setAttribute("data-name", dateEvents[dataDate][i].name);
          ddTime.setAttribute("data-time", dateEvents[dataDate][i].sTime);
          ddTime.setAttribute("data-id", dateEvents[dataDate][i].id);
          ddTime.setAttribute("data-date", dataDate);
          ddTime.onclick = function(){
            eventDetails(this);
          };
          timeText.parentNode.className = "datetime";
          parent.insertBefore(delButton, null);
          parent.insertBefore(updButton, null);
          parent.insertBefore(ddTime, null);
          var ddName = document.createElement("dd");
          ddName.style.cursor = "pointer";
          var nameText = document.createTextNode(dateEvents[dataDate][i].name);
          ddName.appendChild(nameText);
          nameText.parentNode.className = "datetitle";
          ddName.setAttribute("data-name", dateEvents[dataDate][i].name);
          ddName.setAttribute("data-time", dateEvents[dataDate][i].sTime);
          ddName.setAttribute("data-id", dateEvents[dataDate][i].id);
          ddName.setAttribute("data-date", dataDate);
          ddName.onclick = function(){
            eventDetails(this);
          }
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
