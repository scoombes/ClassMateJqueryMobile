//Init DB
var db = openDatabase("classmateDB", "1.0", "ClassMate DB", 2 * 1024 * 1024);

function errorHandler(transaction, error) {
	var msg = "DB ERROR: " + error.message;
	console.log(msg)
	alert(msg);
}

function intializeDatabase() {
	Event.initialize();
	User.initialize();
	Course.initialize();
	EventType.initialize();
	Comment.initialize();
}

function nukeDatabase() {
	Event.nuke();
	User.nuke();
	Course.nuke();
	EventType.nuke();
	Course.nuke();
}

intializeDatabase();