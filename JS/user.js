/* user.js
 *	table that holds all user information
 *
 * 		Sean Coombes - 3/25/15 js file created
 */ 
var User =
{
	initialize: function() {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS user ("
			+ " user_id INTEGER NOT NULL PRIMARY KEY,"
			+ " student_email VARCHAR NOT NULL,"
			+ " password VARCHAR NOT NULL,"
			+ " first_name VARCHAR NOT NULL,"
			+ " last_name VARCHAR NOT NULL)";

			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(email, password, first_name, last_name) {
		db.transaction(function (transaction){
			transaction.executeSql("INSERT INTO user (student_email, password, first_name, last_name) "
				+ "VALUES (?, ?, ?, ?)",[email, password, first_name, last_name], null, errorHandler);
		},errorHandler);
	},
	register: function(email, password, first_name, last_name){
		db.transaction(function (transaction){
			transaction.executeSql("SELECT * FROM user WHERE student_email = ?",[email],
				function (transaction, resultset){
					alert("the shit");
					if (resultset.rows.length == 0) 
					{
						alert("huhu");
						User.insert(email, password, first_name, last_name);
						$("#loginmessage").text("Account created, login to authenticate")
						$.mobile.changePage("login.html", {transition: "none"}); event.preventDefault();
					}
					else
					{
						alert("what?"); 
					}
				}, errorHandler);
		}, errorHandler);
	},
	read: function(id){
		db.transaction(function (transaction) {
			transaction.executeSql("SELECT * FROM user WHERE id = ?",[id],
				null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function (transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS user",[], 
				User.initialize, errorHandler);
		}, errorHandler);
	}
}