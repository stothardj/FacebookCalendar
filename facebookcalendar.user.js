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
</style>'
);

daysOfWeek = ["S","M","T","W","T","F","S"];
monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function Calendar() {
    this.currDate = new Date();
    this.displayMonth = this.currDate.getMonth();
    this.displayYear = this.currDate.getFullYear();
}

calendar = new Calendar();

$('#pagelet_eventbox').empty();
var calendarTable = $('<table id="calendarTable"></table>');
$('#pagelet_eventbox').append(calendarTable);
calendarTable.append('<tr><td id="prevMonth">P</td><td id="monthTitle">' + monthNames[calendar.displayMonth] + ' ' + calendar.displayYear + '</td><td id="nextMonth">N</td></tr>');

calendarTitle.after(calendarMonth);
calendarMonth.after(calendarTable);
$('#pagelet_eventbox').wrap('<div id="facebook_calendar" />');

