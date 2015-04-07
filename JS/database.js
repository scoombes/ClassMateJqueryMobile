/* database.js
 *		Helper methods for dealing with the database
 *		Allows mass init and nuke
 *
 * 		Kyle Zimmerman - 3/25/15 js file created
 */

//App-wide DB object for use whenever DB access is required
var db = openDatabase("classmateDB", "1.0", "ClassMate DB", 2 * 1024 * 1024);

//Displays any error messages in the console and an alert
function errorHandler(transaction, error) {
	var msg = "DB ERROR: " + error.message;
	console.log(msg);
	alert(msg);
}

function parseErrorHandler(error) {
	var msg = "PARSE ERROR (" + error.code + ": " + error.message;
	console.log(msg);
	alert(msg);
}

//Initializes each of the databases
//function intializeDatabase() {
//	Event.initialize();
//	User.initialize();
//	Course.initialize();
//	EventType.initialize();
//	UserCourse.initialize();
//	Vote.initialize();
//	Semester.initialize();
//}

//Nukes each of the databases:
//	drops and re-creates them, useful to clear out test data
function nukeDatabase() {
	Event.nuke();
	User.nuke();
	Course.nuke();
	EventType.nuke();
	Course.nuke();
	UserCourse.nuke();
	Vote.nuke();
	Semester.nuke();
}


//Call initialization on load.
//intializeDatabase();