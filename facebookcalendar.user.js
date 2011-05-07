// ==UserScript==
// @name           FacebookCalendar
// @namespace      https://github.com/stothardj/FacebookCalendar
// @description    Calendar
// @include        http://www.facebook.com/
// @require http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.min.js
// @version        0.1
// ==/UserScript==

$('head').append(
'<style type="text/css">\
#facebook_calendar { \
  color: #0000F0; \
  border-style: solid; \
  border-width: 1px; \
  border-color: #000000; \
  border-radius: 5px; \
  -moz-border-radius: 5px; \
} \
</style>'
);
$('#pagelet_eventbox').empty();
$('#pagelet_eventbox').append(
'<div id="facebook_calendar"> \
<h1>Facebook Calendar</h1> \
<h2>Month</h2> \
1 2 3 4 5 6 7<br/> \
8 9 10 11 12 13<br/> \
14 15 16 17 18 19<br/> \
20 21 22 23 24 25<br/> \
26 27 28 29 30 31<br/> \
</div>'
);

