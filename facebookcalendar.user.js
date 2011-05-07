// ==UserScript==
// @name           FacebookCalendar
// @namespace      https://github.com/stothardj/FacebookCalendar
// @description    Calendar
// @include        http://www.facebook.com/
// @require http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.min.js
// @version        0.1
// ==/UserScript==

// Load facebook api

var script = document.createElement('script');
script.id = 'fbScript';
script.type = 'text/javascript';
script.src = 'http://connect.facebook.net/en_US/all.js';
var head = document.getElementsByTagName("head")[0];
head.appendChild(script);

$('body').append('<div id="fb-root"></div>');

// Load our stylesheet
$('head').append(
'<style type="text/css"> \
#facebook_calendar { \
  color: #000000; \
  border-style: inset; \
  border-width: 1px; \
  border-color: #000000; \
  padding: 0px; \
  margin: 0px; \
  text-align: center; \
} \
table#calendarTable { \
  margin-left: auto; \
  margin-right: auto; \
  width: 100%; \
} \
tr#calendarHead { \
  color: #FFFFFF; \
  background-color: #627aad; \
} \
tr#dayRow { \
  background-color: #F2F2F2; \
} \
h1#calendarMonth { \
  color: #FFFFFF; \
} \
#nextMonth { \
  text-align: center; \
} \
#prevMonth { \
  text-align: center; \
} \
td#monthTitle { \
  text-align: center; \
} \
td.boldedCell { \
  font-size: 14pt; \
  font-weight: 900; \
} \
td.dayCell { \
  text-align: center; \
  padding-top: 5px; \
  padding-bottom: 5px; \
  padding-left: 10px; \
  padding-right: 10px; \
} \
.tooltip { \
	position: absolute; \
	border: 1px solid #333; \
	background-color: #f2f2f2; \
} \
.tooltip h1 { \
	font-family: "lucida grande",tahoma,verdana,arial,sans-serif; \
	font-size: 14px; \
	margin-top: 0px; \
	margin-left: 0px; \
	margin-right: 0px; \
	margin-bottom: 5px; \
	padding: 5px 5px 5px 5px; \
} \
.time { \
	margin-top: 20px; \
	text-align: right; \
	margin: 6px 4px 10px 1px; \
	font-family: "lucida grande",tahoma,verdana,arial,sans-serif; \
} \
#textArea { \
	     resize:none; \
} \
#startDate { \
	width: 100px; \
} \
#endDate { \
	width: 100px; \
} \
.tooltip label{ \
	display:block; \
	font-family: "lucida grande",tahoma,verdana,arial,sans-serif; \
	font-weight:bold; \
	text-align:right; \
	width:100px; \
	margin: 2px 4px 6px 4px; \
	float:left; \
} \
.tooltip input { \
	float:left; \
	font-size:12px; \
	padding:4px 2px; \
	border:solid 1px #aacfe4; \
	width:200px; \
	margin:2px 10px 5px 10px; \
} \
.tooltip textarea { \
	font-family: "lucida grande",tahoma,verdana,arial,sans-serif; \
	float:left; \
	font-size:12px; \
	padding:4px 2px; \
	border:solid 1px #aacfe4; \
	width:200px; \
	margin:0.5px 0 5px 10px; \
} \
.tooltip .small{ \
	color:#666666; \
	display:block; \
	font-size:11px; \
	font-weight:normal; \
	text-align:right; \
	width:140px; \
} \
.tooltip #createEventButton { \
	background: none repeat scroll 0 0 transparent; \
    cursor: pointer; \
    display: inline-block; \
    font-family: "Lucida Grande",Tahoma,Verdana,Arial,sans-serif; \
    font-weight: bold; \
    outline: medium none; \
    padding: 1px 0 2px; \
    white-space: nowrap; \
	width: 8em; \
	background-color: #627AAD; \
	color: white; \
	border: 1px solid #006; \
} \
.tooltip h1 { \
	background-color: #6D84B4; \
	color: white; \
} \
</style>'
);

daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function Calendar() {
    this.currDate = new Date();
    this.displayMonth = this.currDate.getMonth();
    this.displayYear = this.currDate.getFullYear();
}

Calendar.prototype.generateDayHtml = function() {
    var indexOfFirstDay = (new Date(this.displayYear, this.displayMonth, 1)).getDay();
    // Variables that store the previous/next month's date information
    var prevMonth = (this.displayMonth == 0) ? 11 : (this.displayMonth - 1);
    var yearPrevMonth = (this.displayMonth == 0) ? (this.displayYear - 1) : this.displayYear;
    var nextMonth = (this.displayMonth == 11) ? 0 : (this.displayMonth + 1);
    var yearNextMonth = (this.displayMonth == 11) ? (this.displayYear + 1) : this.displayYear;
    var lastMonthLen = getMonthLength(prevMonth, yearPrevMonth);
    var calendarIndex = (indexOfFirstDay == 0) ? (lastMonthLen - 7 + 1) : (lastMonthLen - indexOfFirstDay + 1);

    var running = '';
    // Stages:
    // 0: prevMonth
    // 1: thisMonth
    // 2: nextMonth
    var monthStage = 0;

    for(var week = 0; week < 6; week++) {
	running += '<tr id=calendarRow'+week+'>';
	for(var day in daysOfWeek) {
	    // Set the ID for the current calendar day
	    if(monthStage == 0)
		calendarDayId = zeroPad((prevMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(yearPrevMonth,4);
	    else if(monthStage == 1)
		calendarDayId = zeroPad((this.displayMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(this.displayYear,4);
	    else
		calendarDayId = zeroPad((nextMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(yearNextMonth,4);

	    var bolded = false;
	    if( window.userEvents != undefined )
		for( evi in window.userEvents ) {
		    ev = window.userEvents[evi];
		    // unsafeWindow.console.log(ev.date_key + ' compared against ' + calendarDayId);
		    if( ev.date_key == calendarDayId ) {
			// unsafeWindow.console.log('Same!');
			bolded = true;
			break;
		    }
		}
			
	    running += '<td id="' + calendarDayId + '" class="dayCell';
	    if(bolded)
		running += ' boldedCell';
	    running += '">' + calendarIndex.toString() + '</td>';

	    calendarIndex++;
	    if(monthStage == 0 && calendarIndex > lastMonthLen) {
		calendarIndex = 1;
		monthStage++;
	    } else if(monthStage == 1 && calendarIndex > getMonthLength(this.displayMonth, this.displayYear)) {
		calendarIndex = 1;
		monthStage++;
	    }
	}
	running += '</tr>';
    }

    return running;
}

Calendar.prototype.updateDisplay = function() {
    // unsafeWindow.console.log(this.displayMonth);
    // unsafeWindow.console.log(this.displayYear);
    
    /* Variables that store the previous/next month's date information */
    var prevMonth = (this.displayMonth == 0) ? 11 : (this.displayMonth - 1);
    var yearPrevMonth = (this.displayMonth == 0) ? (this.displayYear - 1) : this.displayYear;
    var nextMonth = (this.displayMonth == 11) ? 0 : (this.displayMonth + 1);
    var yearNextMonth = (this.displayMonth == 11) ? (this.displayYear + 1) : this.displayYear;
    

    $('#monthTitle').html('<h1 id="calendarMonth">' + monthNames[window.calendar.displayMonth] + ' ' + window.calendar.displayYear + '</h1>');
    
    var lastMonthLen = getMonthLength(prevMonth, yearPrevMonth);
    var indexOfFirstDay = (new Date(this.displayYear, this.displayMonth, 1)).getDay();

    // If the first day of the month is on Sunday, we want to have one row displaying the entire week from the last month
    // Otherwise, we want to have the first row contain only a few days from the prev. month and the rest from this month
    var calendarIndex = (indexOfFirstDay == 0) ? (lastMonthLen - 7 + 1) : (lastMonthLen - indexOfFirstDay + 1);
    
    /* monthStage = 0 => last month
       monthStage = 1 => this month
       monthStage = 2 => next month */
    var monthStage = 0;
    var calendarRow, calendarDay, calendarDayId;
    for(var i = 0; i < 6; i++){
	calendarRow = document.getElementById("calendarRow" + i.toString());
	var calendarRowElems = calendarRow.getElementsByTagName("td");
	for(var j = 0; j < 7; j++) {
	    calendarDay = calendarRowElems[j];
	    if(calendarDay.firstChild.nodeType == 3)
		calendarDay.firstChild.nodeValue = calendarIndex.toString();
	    
	    // Set the ID for the current calendar day
	    if(monthStage == 0)
		calendarDayId = zeroPad((prevMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(yearPrevMonth,4);
	    else if(monthStage == 1)
		calendarDayId = zeroPad((this.displayMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(this.displayYear,4);
	    else
		calendarDayId = zeroPad((nextMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(yearNextMonth,4);

	    var bolded = false;
	    if( window.userEvents != undefined )
		for( evi in window.userEvents ) {
		    ev = window.userEvents[evi];
		    // unsafeWindow.console.log(ev.date_key + ' compared against ' + calendarDayId);
		    if( ev.date_key == calendarDayId ) {
			// unsafeWindow.console.log('Same!');
			bolded = true;
			break;
		    }
		}
	    else
		unsafeWindow.console.log( 'window events still not set' );

	    calendarDay.setAttribute("id",calendarDayId);

	    $('#' + calendarDayId).removeClass('boldedCell');
	    if(bolded)
		$('#' + calendarDayId).addClass('boldedCell');
	    
	    calendarIndex++;
	    if(monthStage == 0 && calendarIndex > lastMonthLen) {
		calendarIndex = 1;
		monthStage++;
	    } else if(monthStage == 1 && calendarIndex > getMonthLength(this.displayMonth, this.displayYear)) {
		calendarIndex = 1;
		monthStage++;
	    }
	}
    }
}

Calendar.prototype.prevMonth = function() {
    // unsafeWindow.console.log(this);

    this.displayYear = (this.displayMonth == 0) ? (this.displayYear - 1) : this.displayYear;
    this.displayMonth = (this.displayMonth == 0) ? 11 : (this.displayMonth - 1);

    // unsafeWindow.console.log(this.updateDisplay);

    this.updateDisplay();

}


Calendar.prototype.nextMonth = function() {
    unsafeWindow.console.log(this);
    
    this.displayYear = (this.displayMonth == 11) ? (this.displayYear + 1) : this.displayYear;
    this.displayMonth = (this.displayMonth == 11) ? 0 : (this.displayMonth + 1);

    unsafeWindow.console.log(this.updateDisplay);

    this.updateDisplay();


}

// Works with leap years
function getMonthLength(numMonth, numYear) {
    if(numMonth == 1 && (numYear % 4 == 0 && numYear % 100 != 0) || (numYear % 400 == 0))
	return 29;
    else
	return monthLength[numMonth];
}

// Load graphical calendar
window.calendar = new Calendar();
$('#pagelet_eventbox').empty();
var calendarTable = $('<table id="calendarTable" cellspacing="0"></table>');
$('#pagelet_eventbox').append(calendarTable);
calendarTable.append('<tr id="calendarHead"><td id="prevMonth">&lt;</td><td id="monthTitle" colspan="5"><h1 id="calendarMonth">' + monthNames[window.calendar.displayMonth] + ' ' + window.calendar.displayYear + '</h1></td><td id="nextMonth">&gt;</td></tr>');

var dayRow = '<tr id="dayRow">';
for(var day in daysOfWeek )
    dayRow += '<th>' + daysOfWeek[day] + '</th>';
dayRow += '</tr>';

calendarTable.append(dayRow);
calendarTable.append(calendar.generateDayHtml());

$('#pagelet_eventbox').wrap('<div id="facebook_calendar" />');

unsafeWindow.console.log(window.calendar);
unsafeWindow.console.log(window.calendar.updateDisplay);

$("#prevMonth").click(window.calendar.prevMonth.bind(window.calendar));
$("#nextMonth").click(window.calendar.nextMonth.bind(window.calendar));

// Given a number, num, it returns a string with num and count padded leading zeros
function zeroPad(num,count) {
    var numZeropad = num.toString();
    while(numZeropad.length < count) {
	numZeropad = "0" + numZeropad;
    }
    return numZeropad;
}

// Load events
$('#fbScript').load(function() {
    MY_APP_ID = "224239124259086";
    userSession = null;
    userAccessToken = null;
    userSessionKey = null;
    userId = null;
    userEvents = null;
    
    unsafeWindow.FB.init({
	appId: MY_APP_ID, cookie:false,
	status:true, xfbml:true
    });
    
    unsafeWindow.FB.getLoginStatus(function(response) {
	if (response.session) {
	    userSession = response.session;
	    userAccessToken = userSession.access_token;
	    userSessionKey = userSession.session_key;
	    userId = userSession.uid;
	    
	    unsafeWindow.FB.api({ method: 'events.get' }, function(response) {
		window.userEvents = response;
		for(evi in window.userEvents) {
		    ev = window.userEvents[evi];
		    if(ev.start_time != undefined) {
			ev.start_date = new Date(ev.start_time * 1000);
			var day = ev.start_date.getDay() + 1;
			var mon = ev.start_date.getMonth() + 1;
			var yea = ev.start_date.getFullYear();
			ev.date_key = zeroPad(mon, 2) + zeroPad(day, 2) + zeroPad(yea, 4);
			unsafeWindow.console.log(ev.date_key);
		    }
		    // unsafeWindow.console.log(ev.name+ ' ' +ev.start_time);
		}
		unsafeWindow.console.log('window.calendar is '+window.calendar);
		if(window.calendar != undefined) {
		    unsafeWindow.console.log("calling update display");
		    window.calendar.updateDisplay().bind(window.calendar);
		}
		unsafeWindow.console.log(window.userEvents);
	    });
	    
	} else {
	    // no user session available, someone you dont know
	}
    });
});

$('.dayCell').click(function(e){
	// append a form
	var tooltipExists = $('.tooltip').length;

	var tooltipForm = $('#stylized');
	tooltipForm
	.css('top', (e.pageY-50) + 'px')
	.css('left', (e.pageX+20) + 'px')
	.css('background-color', '#ebf4fb');
	
	if (tooltipExists > 0) {
		// tooltip exists
		$('.tooltip').remove();
	}
	else {
		// start time
		// end time
		// end date
		// tooltip doesn't exist
	
		// TO-DO:
		// add an event photo?
		var tooltipForm =
		        + '<div id="stylized" class="myform">'
		        + '<form class="tooltip">'
				  + '<div id="tipofheader">'
		        + '<h1>Create an Event</h1>'
				  + '</div>'
		        + '<label>Event Name:</label><input type="text" name="eventName" /><br />'
				  + '<label>Start Time:</label><input type="text" name="startDate" id="startDate" />'
				  + '<select class=time name="startTime">'
				  + '<option value="am_1200">12:00 am</option>'
		        + '<option value="am_1230">12:30 am</option>'
		        + '<option value="am_0100">1:00 am</option>'
		        + '<option value="am_0130">1:30 am</option>'
		        + '<option value="am_0200">2:00 am</option>'
		        + '<option value="am_0230">2:30 am</option>'
		        + '<option value="am_0300">3:00 am</option>'
		        + '<option value="am_0330">3:30 am</option>'
		        + '<option value="am_0400">4:00 am</option>'
		        + '<option value="am_0430">4:30 am</option>'
		        + '<option value="am_0500">5:00 am</option>'
		        + '<option value="am_0530">5:30 am</option>'
		        + '<option value="am_0600">6:00 am</option>'
		        + '<option value="am_0630">6:30 am</option>'
		        + '<option value="am_0700">7:00 am</option>'
		        + '<option value="am_0730">7:30 am</option>'
		        + '<option value="am_0800">8:00 am</option>'
		        + '<option value="am_0830">8:30 am</option>'
		        + '<option value="am_0900">9:00 am</option>'
		        + '<option value="am_0930">9:30 am</option>'
		        + '<option value="am_1000">10:00 am</option>'
		        + '<option value="am_1030">10:30 am</option>'
		        + '<option value="am_1100">11:00 am</option>'
		        + '<option value="am_1130">11:30 am</option>'
		        + '<option value="pm_1200">12:00 pm</option>'
		        + '<option value="pm_1230">12:30 pm</option>'
		        + '<option value="pm_0100">1:00 pm</option>'
		        + '<option value="pm_0130">1:30 pm</option>'
		        + '<option value="pm_0200">2:00 pm</option>'
		        + '<option value="pm_0230">2:30 pm</option>'
		        + '<option value="pm_0300">3:00 pm</option>'
		        + '<option value="pm_0330">3:30 pm</option>'
		        + '<option value="pm_0400">4:00 pm</option>'
		        + '<option value="pm_0430">4:30 pm</option>'
		        + '<option value="pm_0500">5:00 pm</option>'
		        + '<option value="pm_0530">5:30 pm</option>'
		        + '<option value="pm_0600">6:00 pm</option>'
		        + '<option value="pm_0630">6:30 pm</option>'
		        + '<option value="pm_0700">7:00 pm</option>'
		        + '<option value="pm_0730">7:30 pm</option>'
		        + '<option value="pm_0800">8:00 pm</option>'
		        + '<option value="pm_0830">8:30 pm</option>'
		        + '<option value="pm_0900">9:00 pm</option>'
		        + '<option value="pm_0930">9:30 pm</option>'
		        + '<option value="pm_1000">10:00 pm</option>'
		        + '<option value="pm_1030">10:30 pm</option>'
		        + '<option value="pm_1100">11:00 pm</option>'
		        + '<option value="pm_1130">11:30 pm</option>'
		        + '</select><br />'
		        + '<label>End Time:</label><input type="text" name="endDate" id="endDate"/>'
				  + '<select class=time name="endTime">'
		        + '<option value="am_1200">12:00 am</option>'
		        + '<option value="am_1230">12:30 am</option>'
		        + '<option value="am_0100">1:00 am</option>'
		        + '<option value="am_0130">1:30 am</option>'
		        + '<option value="am_0200">2:00 am</option>'
		        + '<option value="am_0230">2:30 am</option>'
		        + '<option value="am_0300">3:00 am</option>'
		        + '<option value="am_0330">3:30 am</option>'
		        + '<option value="am_0400">4:00 am</option>'
		        + '<option value="am_0430">4:30 am</option>'
		        + '<option value="am_0500">5:00 am</option>'
		        + '<option value="am_0530">5:30 am</option>'
		        + '<option value="am_0600">6:00 am</option>'
		        + '<option value="am_0630">6:30 am</option>'
		        + '<option value="am_0700">7:00 am</option>'
		        + '<option value="am_0730">7:30 am</option>'
		        + '<option value="am_0800">8:00 am</option>'
		        + '<option value="am_0830">8:30 am</option>'
		        + '<option value="am_0900">9:00 am</option>'
		        + '<option value="am_0930">9:30 am</option>'
		        + '<option value="am_1000">10:00 am</option>'
		        + '<option value="am_1030">10:30 am</option>'
		        + '<option value="am_1100">11:00 am</option>'
		        + '<option value="am_1130">11:30 am</option>'
		        + '<option value="pm_1200">12:00 pm</option>'
		        + '<option value="pm_1230">12:30 pm</option>'
		        + '<option value="pm_0100">1:00 pm</option>'
		        + '<option value="pm_0130">1:30 pm</option>'
		        + '<option value="pm_0200">2:00 pm</option>'
		        + '<option value="pm_0230">2:30 pm</option>'
		        + '<option value="pm_0300">3:00 pm</option>'
		        + '<option value="pm_0330">3:30 pm</option>'
		        + '<option value="pm_0400">4:00 pm</option>'
		        + '<option value="pm_0430">4:30 pm</option>'
		        + '<option value="pm_0500">5:00 pm</option>'
		        + '<option value="pm_0530">5:30 pm</option>'
		        + '<option value="pm_0600">6:00 pm</option>'
		        + '<option value="pm_0630">6:30 pm</option>'
		        + '<option value="pm_0700">7:00 pm</option>'
		        + '<option value="pm_0730">7:30 pm</option>'
		        + '<option value="pm_0800">8:00 pm</option>'
		        + '<option value="pm_0830">8:30 pm</option>'
		        + '<option value="pm_0900">9:00 pm</option>'
		        + '<option value="pm_0930">9:30 pm</option>'
		        + '<option value="pm_1000">10:00 pm</option>'
		        + '<option value="pm_1030">10:30 pm</option>'
		        + '<option value="pm_1100">11:00 pm</option>'
		        + '<option value="pm_1130">11:30 pm</option>'
		        + '</select><br />' 
		        + '<label>Where:</label><input type="text" name="location" /><br />'
		        + '<label>Description:</label><textarea name="description" cols="40" rows="5" id=textArea></textarea><br />'
		        + '<label>&nbsp; </label><input type="submit" value="Create Event" id=createEventButton />'
		        + '</form>'
		        + '</div>';
		$(tooltipForm)
			.appendTo('body')
			.css('top', (e.pageY-10) + 'px')
			.css('left', (e.pageX+20) + 'px')
			//.css('background-color', '#ebf4fb')
			.fadeIn('slow');
			
		
		
		
		$('#createEventButton').click(function() {
			alert('button clicked!');
		});

	}	
});