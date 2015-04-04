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
	read: function (eventId, userId) {
		db.transaction(function (transaction) {
			var sqlString = "SELECT value FROM vote "
				+ "WHERE user_id=? AND event_id=?;";
			transaction.executeSql(sqlString, [userId, eventId], null, errorHandler);
		}, errorHandler);
	},
	readEventVotes: function (eventId, setEventVoteBar) {
		db.transaction(function (transaction) {
			var upvoteSql = "SELECT  COUNT(value) AS upvote, event_id AS eventId FROM vote "
				+ "WHERE value > 0 AND event_id=" + eventId;
			var downvoteSql = "SELECT  COUNT(value) AS downvote, event_id AS eventId FROM vote "
				+ "WHERE value < 0 AND event_id=" + eventId;
			var sqlString = "SELECT upvoteTable.upvote, downvoteTable.downvote FROM (" + upvoteSql + ") upvoteTable "
				+ "JOIN (" + downvoteSql + ") downvoteTable ON upvoteTable.eventId = downvoteTable.eventId;";
			transaction.executeSql(sqlString, [], setEventVoteBar, errorHandler);
		});
	},
	remove: function(event_id, user_id) {
		db.transaction(function (transaction) {
			var sqlString = "DELETE FROM vote "
				+ "WHERE event_id=? AND user_id=?;";
			transaction.executeSql(sqlString, [eventId, userId], null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function (transaction) {
			var sqlString = "DROP TABLE IF EXISTS vote;";
			transaction.executeSql(sqlString, [], Vote.initialize, errorHandler);
		}, errorHandler);
	}
};