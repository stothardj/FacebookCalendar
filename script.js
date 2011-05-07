daysOfWeek = ["S","M","T","W","T","F","S"];
monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

function Calendar(){
	this.currDate = new Date();
	this.displayMonth = this.currDate.getMonth();
	this.displayYear = this.currDate.getFullYear();
	
	addLoadEvent(this.initCalendar());
}

Calendar.prototype.initCalendar = function() {
	
	/* Checks to ensure javascript is enabled */
	if (!document.createElement) return false;
	if (!document.createTextNode) return false;
	if (!document.getElementById) return false;
	if (!document.getElementsByTagName) return false;
	
	/* Variables that store the previous/next month's date information */
	var prevMonth = (this.displayMonth == 0) ? 11 : (this.displayMonth - 1);
	var yearPrevMonth = (this.displayMonth == 0) ? (this.displayYear - 1) : this.displayYear;
	var nextMonth = (this.displayMonth == 11) ? 0 : (this.displayMonth + 1);
	var yearNextMonth = (this.displayMonth == 11) ? (this.displayYear + 1) : this.displayYear;
	
	/* Create the table and set the first row of the table to
	have the month/year and buttons to go back/front a month */
	var calendarTable = document.createElement("table");
	calendarTable.setAttribute("id","calendarTable");
	var titleText = monthNames[this.displayMonth] + " " + this.displayYear;
	var topRow = document.createElement("tr");
	var title = document.createElement("td");
	title.setAttribute("id","monthTitle");
	title.appendChild(document.createTextNode(titleText));
	var controlButtons = document.createElement("td");
	var prevMonthButton = document.createElement("span");
	var nextMonthButton = document.createElement("span");
	prevMonthButton.setAttribute("id","prevMonth");
	nextMonthButton.setAttribute("id","nextMonth");
	prevMonthButton.onclick = this.prevMonth.bind(this);
	nextMonthButton.onclick = this.nextMonth.bind(this);
	prevMonthButton.appendChild(document.createTextNode("P")); // TODO: Replace with IMG
	nextMonthButton.appendChild(document.createTextNode("N")); // TODO: Replace with IMG
	controlButtons.appendChild(prevMonthButton);
	controlButtons.appendChild(nextMonthButton);
	topRow.appendChild(title);
	topRow.appendChild(controlButtons);
	calendarTable.appendChild(topRow);
	
	/* Set the calendar header to contain the days of the week */
	var daysOfWeekRow = document.createElement("tr");
	for(var i = 0; i < 7; i++) {
		var currDayElem = document.createElement("td");
		currDayElem.appendChild(document.createTextNode(daysOfWeek[i]));
		daysOfWeekRow.appendChild(currDayElem);
	}
	calendarTable.appendChild(daysOfWeekRow);
	
	var lastMonthLen = getMonthLength(prevMonth, yearPrevMonth);
	var indexOfFirstDay = (new Date(this.displayYear, this.displayMonth, 1)).getDay();
	
	// If the first day of the month is on Sunday, we want to have one row displaying the entire week from the last month
	// Otherwise, we want to have the first row contain only a few days from the prev. month and the rest from this month
	var calendarIndex = (indexOfFirstDay == 0) ? (lastMonthLen - 7 + 1) : (lastMonthLen - indexOfFirstDay + 1);
	
	/* monthStage = 0 => last month
	   monthStage = 1 => this month
	   monthStage = 2 => next month */
	var monthStage = 0;
	var calendarRow, calendarDay, calendarDayId, calendarDayText;
	for(var i = 0; i < 6; i++){
		calendarRow = document.createElement("tr");
		calendarRow.setAttribute("id",("calendarRow" + i.toString()));
		for(var j = 0; j < 7; j++) {
			calendarDay = document.createElement("td");
			calendarDayText = document.createTextNode(calendarIndex.toString());
			calendarDay.appendChild(calendarDayText);
			
			// Set the ID for the current calendar day
			if(monthStage == 0)
				calendarDayId = zeroPad((prevMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(yearPrevMonth,4);
			else if(monthStage == 1)
				calendarDayId = zeroPad((this.displayMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(this.displayYear,4);
			else
				calendarDayId = zeroPad((nextMonth + 1), 2) + zeroPad(calendarIndex, 2) + zeroPad(yearNextMonth,4);
			calendarDay.setAttribute("id",calendarDayId);
				
			calendarIndex++;
			if(monthStage == 0 && calendarIndex > lastMonthLen) {
				calendarIndex = 1;
				monthStage++;
			} else if(monthStage == 1 && calendarIndex > getMonthLength(this.displayMonth, this.displayYear)) {
				calendarIndex = 1;
				monthStage++;
			}
			calendarRow.appendChild(calendarDay);
		}
		calendarTable.appendChild(calendarRow);
	}
	
	var bodyElem = document.getElementsByTagName("body")[0];
	bodyElem.appendChild(calendarTable);
	return true;
}


Calendar.prototype.updateDisplay = function() {
	
	/* Variables that store the previous/next month's date information */
	var prevMonth = (this.displayMonth == 0) ? 11 : (this.displayMonth - 1);
	var yearPrevMonth = (this.displayMonth == 0) ? (this.displayYear - 1) : this.displayYear;
	var nextMonth = (this.displayMonth == 11) ? 0 : (this.displayMonth + 1);
	var yearNextMonth = (this.displayMonth == 11) ? (this.displayYear + 1) : this.displayYear;
	
	var monthTitle = document.getElementById("monthTitle");
	if(monthTitle.firstChild.nodeType == 3)
		monthTitle.firstChild.nodeValue = (monthNames[this.displayMonth] + " " + this.displayYear);
	
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
			calendarDay.setAttribute("id",calendarDayId);
			
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
	
	this.displayYear = (this.displayMonth == 0) ? (this.displayYear - 1) : this.displayYear;
	this.displayMonth = (this.displayMonth == 0) ? 11 : (this.displayMonth - 1);
	this.updateDisplay().bind(this);
}

Calendar.prototype.nextMonth = function() {
	
	this.displayYear = (this.displayMonth == 11) ? (this.displayYear + 1) : this.displayYear;
	this.displayMonth = (this.displayMonth == 11) ? 0 : (this.displayMonth + 1);
	this.updateDisplay().bind(this);
}

/* Given a month and a year, this function returns the length of the month, taking into account leap years */
function getMonthLength(numMonth, numYear) {
	if(numMonth == 1 && (numYear % 4 == 0 && numYear % 100 != 0) || (numYear % 400 == 0))
		return 29;
	else
		return monthLength[numMonth];
}

/* Given a number, num, it returns a string with num and count padded leading zeros */
function zeroPad(num,count) {
	var numZeropad = num.toString();
	while(numZeropad.length < count) {
		numZeropad = "0" + numZeropad;
	}
	return numZeropad;
}

var calendar = new Calendar();