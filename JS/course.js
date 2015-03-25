var Course =
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sql = "CREATE TABLE IF NOT EXISTS event ("
				+ "id INTEGER PRIMARY KEY,"
				+ "event_type INTEGER,"
				+ "due_date DATETIME,"
				+ "final_grade_weight INTEGER,"
				+ "description VARCHAR,"
				+ "creator INTEGER"
				+ ")"; 

			transaction.executeSql(sql, [], null, errorHandler);

		}, errorHandler);
	},
	insert: function(event_type, due_date, final_grade_weight, description, creator) {
		db.transaction(function(transaction) {
			var sql = "INSERT INTO event ("
				+ "event_type,"
				+ "due_date,"
				+ "final_grade_weight,"
				+ "description,"
				+ "creator"
				+ ") VALUES (?,?,?,?,?)";

			transaction.executeSql(sql, 
				[event_type, due_date, final_grade_weight, description, creator], null, errorHandler);
		}, errorHandler);
	}, 
	nuke: function() {
		db.transaction(function(transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS event", [], Event.initialize, errorHandler);
		}, errorHandler);
	}
}