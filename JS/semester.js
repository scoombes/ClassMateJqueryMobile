var Semester = 
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS semester ("
				+ "semester_id INTEGER NOT NULL PRIMARY KEY,"
				+ "semester_name VARCHAR(10) NOT NULL);";
			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(semester_name) {
		db.transaction(function(transaction) {
			var sqlString = "INSERT INTO semester (semester_name) VALUES (?);";
			transaction.executeSql(sqlString, [semester_name], null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function(transaction) {
			var sqlString = "DELETE FROM semester WHERE semester_name=?;";
			transaction.executeSql(sqlString, [semester_name], null, errorHandler);
		}, errorHandler);
	}
};