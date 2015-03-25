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
			+ " first_name VARCHAR NOT NULL"
			+ " last_name VARCHAR NOT NULL)";

			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(email, password, first_name, last_name) {
		dv.transaction(function (transaction)
		{
			transaction.executeSql("INSERT INTO user (student_email, password, first_name, last_name) "
				+ "VALUES (?, ?, ?, ?)",[email, password, first_name, last_name], null, errorHandler);
		},errorHandler);
	},
	nuke: function() {
		db.transaction(function (transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS user",[], User.initialize, errorHandler);
		}, errorHandler);
	}
}