/* vote.js
 *		creates the vote object with various functionalities
 *
 * 		Justin Coschi - 3/25/15 js file created
 */ 
var Vote = 
{
	initialize: function () {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS vote ("
				+ "event_id INTEGER NOT NULL, "
				+ "user_id INTEGER NOT NULL, "
				+ "value INTEGER NOT NULL, "
				+ "PRIMARY KEY (event_id, user_id));";
			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function (event_id, user_id, value) {
		db.transaction(function (transaction) {
			var sqlString = "SELECT * FROM vote WHERE event_id=? AND user_id=?;";
			var params;
			transaction.executeSql(sqlString, [event_id, user_id], function (transaction, results) {
				if (results.rows.length === 0) {
					sqlString = "INSERT INTO vote (event_id, user_id, value) VALUES (?, ?, ?);";
					params = [event_id, user_id, value];
				}
				else {
					sqlString = "UPDATE vote SET event_id=?, user_id=?, value=? "
						+ "WHERE event_id=? AND user_id=?;";
					params = [event_id, user_id, value, event_id, user_id];
				}
				transaction.executeSql(sqlString, params, null, errorHandler);
			}, errorHandler);
		}, errorHandler);
	},
	read: function (event_id, user_id, set_initial_user_vote) {
			db.transaction(function (transaction) {
			var sqlString = "SELECT * FROM vote WHERE event_id=? AND user_id=?;";
			transaction.executeSql(sqlString, [event_id, user_id], set_initial_user_vote, errorHandler);
		}, errorHandler);
	},
	remove: function (event_id, user_id) {
		db.transaction(function (transaction) {
			var sqlString = "DELETE FROM vote "
				+ "WHERE event_id=? AND user_id=?;";
			transaction.executeSql(sqlString, [event_id, user_id], null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function (transaction) {
			var sqlString = "DROP TABLE IF EXISTS vote;";
			transaction.executeSql(sqlString, [], Vote.initialize, errorHandler);
		}, errorHandler);
	}
};