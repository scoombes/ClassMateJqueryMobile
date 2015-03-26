var Semester = 
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS semester ("
				+ "id INTEGER NOT NULL PRIMARY KEY,"
				+ "semester_name VARCHAR(10) NOT NULL);";

			transaction.executeSql(sqlString, [], null, errorHandler);

			transaction.executeSql("SELECT * FROM semester", [], function(transaction, resultset) {
				if (resultset.rows.length == 0) {
					EventType.insert("Fall");
					EventType.insert("Winter");
					EventType.insert("Spring");
				}
			}, errorHandler);

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
			var sqlString = "DROP TABLE IF EXISTS semester;";
			transaction.executeSql(sqlString, [], Semester.initialize, errorHandler);
		}, errorHandler);
	}
};