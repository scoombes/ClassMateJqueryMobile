var Vote = 
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS vote ("
				+ "event_id VARCHAR NOT NULL PRIMARY KEY,"
				+ "user_id VARCHAR NOT NULL PRIMARY KEY,"
				+ "value INTEGER NOT NULL);";
			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(event_id, user_id, value) {
		db.transaction(function(transaction) {
			var sqlString = "INSERT INTO vote (event_id, user_id, value) VALUES (?, ?, ?);";
			transaction.executeSql(sqlString, [event_id, user_id, value], null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function(transaction) {
			var sqlString = "DROP TABLE IF EXISTS vote;";
			transaction.executeSql(sqlString, [], Vote.initialize, errorHandler);
		}, errorHandler);
	}
};