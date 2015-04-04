var Vote = 
{
	initialize: function() {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS vote ("
				+ "event_id INTEGER NOT NULL, "
				+ "user_id INTEGER NOT NULL, "
				+ "value INTEGER NOT NULL, "
				+ "PRIMARY KEY (event_id, user_id));";
			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(event_id, user_id, value) {
		db.transaction(function (transaction) {
			var sqlString = "SELECT * FROM vote WHERE event_id=? AND user_id=?;";
			transaction.executeSql(sqlString, [event_id, user_id], function (transaction, results) {
				if (results.rows.length === 0) {
					sqlString = "INSERT INTO vote (event_id, user_id, value) VALUES (?, ?, ?);";
				}
				else {
					sqlString = "UPDATE vote SET event_id=?, user_id=?, value=? "
						+ "WHERE event_id=? AND user_id=?;";
				}
				transaction.executeSql(sqlString, [event_id, user_id, value], null, errorHandler);
			}, errorHandler);
		}, errorHandler);
	},
	read: function (event_id, user_id, check_if_vote) {
		db.transaction(function (transaction) {
			var sqlString = "SELECT * FROM vote WHERE event_id=? AND user_id=?;";
			transaction.executeSql(sqlString, [event_id, user_id], check_if_vote, errorHandler);
		}, errorHandler);
	},
	remove: function(event_id, user_id) {
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