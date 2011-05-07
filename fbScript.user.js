// ==UserScript==
// @name           fbScript
// @namespace      www.nima360.com
// @description    Facebook API Script
// @require http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.min.js
// @include        http://www.facebook.com/*
// ==/UserScript==

alert("hello");

var script = document.createElement('script');
script.id = 'fbScript';
script.type = 'text/javascript';
script.src = 'http://connect.facebook.net/en_US/all.js';
var head = document.getElementsByTagName("head")[0];
head.appendChild(script);

$('body').append('<div id="fb-root"></div>');

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
				userEvents = response;
				alert(userEvents[0]['name']);
				unsafeWindow.console.log(userEvents);
			});
			
	    } else {
			// no user session available, someone you dont know
	    }
	});
});