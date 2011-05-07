// ==UserScript==
// @name           Hello World
// @namespace      www.nima360.com
// @description    Hello World Script
// @include        http://www.facebook.com/*
// @require http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.min.js
// @version 0.1
// ==/UserScript==


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

	unsafeWindow.console.log(unsafeWindow.FB);
	unsafeWindow.FB.init({
	    appId: MY_APP_ID, cookie:true,
	    status:true, xfbml:true
	});

	unsafeWindow.FB.getLoginStatus(function(response) {
	    if (response.session) {
			userSession = response.session;
			userAccessToken = userSession.access_token;
			userSessionKey = userSession.session_key;
			userId = userSession.uid;
			userEvents = unsafeWindow.FB.api('/me/events', function(response) {
				userEvents = response;
				unsafeWindow.console.log(userEvents);
			});
	    } else {
			// no user session available, someone you dont know
	    }
	});
});