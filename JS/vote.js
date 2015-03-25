var Vote = 
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS vote ("
				+ "id INTEGER NOT NULL PRIMARY KEY,"
				+ "semester_name VARCHAR(10) NOT NULL);";
			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(semester_name) {
		db.transaction(function(transaction) {
			var sqlString = "INSERT INTO vote (semester_name) VALUES (?);";
			transaction.executeSql(sqlString, [semester_name], null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function(transaction) {
			var sqlString = "DROP TABLE IF EXISTS vote;";
			transaction.executeSql(sqlString, [semester_name], Vote.initialize, errorHandler);
		}, errorHandler);
	}
};