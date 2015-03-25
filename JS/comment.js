/* comment.js
 *	table that holds all comments
 *
 * 		Sean Coombes - 3/25/15 js file created
 */ 
var Comment =
{
	initialize: function() {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS comment ("
			+ " id INTEGER NOT NULL PRIMARY KEY,"
			+ " post_id INTEGER NOT NULL,"
			+ " body VARCHAR NOT NULL,"
			+ " user_id INTEGER NOT NULL)";

			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(post_id, body, user_id) {
		dv.transaction(function (transaction)
		{
			transaction.executeSql("INSERT INTO comment (id, body, user_id) "
				+ "VALUES (?, ?, ?)",[post_id, body, user_id], null, errorHandler);
		},errorHandler);
	},
	nuke: function() {
		db.transaction(function (transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS user",[], Comment.initialize, errorHandler);
		}, errorHandler);
	}
}