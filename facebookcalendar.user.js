// ==UserScript==
// @name           FacebookCalendar
// @namespace      https://github.com/stothardj/FacebookCalendar
// @description    Calendar
// @include        http://www.facebook.com/
// @require http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.min.js
// @version        0.1
// ==/UserScript==

$('head').append(
'<style type="text/css"> \
#facebook_calendar { \
  color: #0000F0; \
  border-style: solid; \
  border-width: 1px; \
  border-color: #000000; \
  border-radius: 5px; \
  -moz-border-radius: 5px; \
  padding: 5px; \
} \
td.monthTitle { \
  text-align: center; \
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

Calendar.prototype = {
    generateDayHtml: function() {

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
	    running += '<tr>';
	    for(var day in daysOfWeek) {
		running += '<td>' + calendarIndex.toString() + '</td>';
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
}

// Works with leap years
function getMonthLength(numMonth, numYear) {
    if(numMonth == 1 && (numYear % 4 == 0 && numYear % 100 != 0) || (numYear % 400 == 0))
	return 29;
    else
	return monthLength[numMonth];
}

calendar = new Calendar();

$('#pagelet_eventbox').empty();
var calendarTable = $('<table id="calendarTable"></table>');
$('#pagelet_eventbox').append(calendarTable);
calendarTable.append('<tr><td class="prevMonth">P</td><td class="monthTitle" colspan="5">' + monthNames[calendar.displayMonth] + ' ' + calendar.displayYear + '</td><td class="nextMonth">N</td></tr>');

var dayRow = '<tr>';
for(var day in daysOfWeek )
    dayRow += '<th>' + daysOfWeek[day] + '</th>';
dayRow += '</tr>';

calendarTable.append(dayRow);
calendarTable.append(calendar.generateDayHtml());
calendarTitle.after(calendarMonth);
calendarMonth.after(calendarTable);
$('#pagelet_eventbox').wrap('<div id="facebook_calendar" />');

