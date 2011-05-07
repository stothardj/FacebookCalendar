MY_APP_ID = "224239124259086";
userSession = null;
userAccessToken = null;
userSessionKey = null;
userId = null;
userEvents = null;

FB.init({ 
    appId: MY_APP_ID, cookie:true, 
    status:true, xfbml:true 
});


FB.getLoginStatus(function(response) {
    if (response.session) {
	userSession = response.session;
	userAccessToken = userSession.access_token;
	userSessionKey = userSession.session_key;
	userId = userSession.uid;
    } else {
	// no user session available, someone you dont know
    }
});

userEvents = FB.api(
    {
	method: 'events.get',
    },
    function(response) {
	userEvents = response;
	console.log(userEvents);
    }
);
