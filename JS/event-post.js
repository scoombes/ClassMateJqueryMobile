/* event-post.js
 *	intersection table fort events and posts
 *
 * 		Sean Coombes - 3/25/15 js file created
 */ 
var EventPost =
{
	initialize: function() {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS event_post ("
			+ " event_id INTEGER NOT NULL,"
			+ " post_id INTEGER NOT NULL)";

			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(event_id, post_id) {
		dv.transaction(function (transaction)
		{
			transaction.executeSql("INSERT INTO event_post (event_id, post_id) "
				+ "VALUES (?, ?)",[event_id, post_id], null, errorHandler);
		},errorHandler);
	},
	nuke: function() {
		db.transaction(function (transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS event_post",[], 
				EventPost.initialize, errorHandler);
		}, errorHandler);
	}
}