$(document).ready(function(){
  $('#specialRow').click(function(e){
	/*
		append a form
	*/
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
			.css('top', (e.pageY-50) + 'px')
			.css('left', (e.pageX+20) + 'px')
			//.css('background-color', '#ebf4fb')
			.fadeIn('slow');
		
		$('#createEventButton').click(function() {
			alert('button clicked!');
		});
		/*
		stylizedDiv.css({
			'font-size' : '14px',
			'font-weight' : 'bold',
			'color' : 'yellow',
			'margin-bottom' : '8px'
		});
		*/
	}	
  });
/*
	.mousemove(function(e){
    // Mouse move code
	$('.tooltip')
		.css('top', (e.pageY-50) + 'px')
		.css('left', (e.pageX+20) + 'px');
  });
*/
});
