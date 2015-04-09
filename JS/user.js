/* user.js
 *	table that holds all user information
 *
 * 		Sean Coombes - 3/25/15 js file created
 */
//var UserObject = parseInt.Object.extend("User");
var User =
{
	//registers a user (Verifies the email address is not taken)
	register: function(email, username, password, firstName, lastName){
	    var user = new Parse.User();

	    user.set("email", email);
	    user.set("username", username);
	    user.set("password", password);
	    user.set("firstName", firstName);
	    user.set("lastName", lastName);

	    user.signUp(null, {
	        success: function(user){
	            $.mobile.changePage("event-feed.html", { transition: "none" });
	        },
	        error: function(user, error){
	            $("#signup-error").text(error.message);
	        }
	    });
	},
    //Logs a user in using the provided credentials 
	login: function (name, pass){
	    Parse.User.logIn(name, pass, {
	        success: function(user){
	            $.mobile.changePage("event-feed.html", { transition: "none" });
	        },
	        error: function(user, error){
	            $("#loginmessage").text(error.message);
	        }
	    });
	    if ($("#remember").prop("checked", true)){
	        localStorage.setItem("rem", "true");
	    }
	},
	logout: function(){
	    Parse.User.logOut();
	    localStorage.clear();
	    $.mobile.changePage("login.html", { transition: "none" });
	},
	//Drops the table and re-initializes it
	nuke: function() {
		
	},
	//Gets the currently signed in user
	isCurrent: function()
	{
	    return Parse.User.current();
	},
	isAuthenticated: function()
	{
	    return Parse.User.authenticated();
	}
};