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
