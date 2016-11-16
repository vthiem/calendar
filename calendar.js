var currentDate = new Date();
var currentMonthNum = currentDate.getMonth();
var currentDayNum = currentDate.getDate();
var currentWeekdayNum = currentDate.getDay();
var currentYearNum = currentDate.getFullYear();

var tempMonthNum = currentMonthNum;
var tempYearNum = currentYearNum;

var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekdays = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
var monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
}

function getNextMonth(){
  if(tempMonthNum === 11){
    tempYearNum += 1;
    tempMonthNum = 0;
  }
  else{
    tempMonthNum += 1;
  }
  setupCalendar(tempYearNum, tempMonthNum, false);
}

function getPrevMonth(){
  if(tempMonthNum == 0){
    tempYearNum -= 1;
    tempMonthNum = 11;
  }
  else{
    tempMonthNum -= 1;
  }
  setupCalendar(tempYearNum, tempMonthNum, false);
}

function setupCalendar(yr, mth, initial){
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
            tbl.rows[i].cells[j].innerHTML = count;
            started = true;
            count+= 1;
        }
        else if(count <= numDays && started){
          tbl.rows[i].cells[j].innerHTML = count;
          count+=1;
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
 setupCalendar(currentYearNum, currentMonthNum, true);
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
    document.getElementById("monthlyview").style.display = "none";
    document.getElementById("weeklyPanel").style.display = "none";
    document.getElementById("weeklyview").style.display = "inline";
    document.querySelector(".weekview th").innerHTML = weekHeading + ": " + months[tempMonthNum] + " " + firstDate + "-" + lastDate + " " + tempYearNum;
  }

  function SlideEventPanel(cell){
    if(!isNaN(parseInt(cell.innerHTML))){
      if(document.getElementById("rightdrawer").style.zIndex === "3"){
        prevCell.style.color= "#90a9d4";
        prevCell.style.backgroundColor="white";
        document.getElementById("addEvent").style.marginRight = "0px";
        document.getElementById("rightdrawer").style.width = "0px";
        document.getElementById("rightdrawer").style.zIndex="-1";
      }
      else{
        prevCell = cell;
        cell.style.backgroundColor = "#90a9d4";
        cell.style.color = "white";
        document.getElementById("addEvent").style.marginRight = "105px";
        document.getElementById("drawerHeader").innerHTML = weekdays[cell.cellIndex] + ", " + monthsAbbr[tempMonthNum] + " " + cell.innerHTML + " " + tempYearNum;
        document.getElementById("rightdrawer").style.zIndex="3";
        document.getElementById("rightdrawer").style.width = "250px";
      }
    }
  }
}
