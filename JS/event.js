var Event =
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

			transaction.executeSql(sql, [event_type, due_date, final_grade_weight, description, creator], null, errorHandler);
		}, errorHandler);
	}, 
	read: function (id) {
		db.transaction(function (transaction) {
			transaction.executeSql("SELECT * FROM event WHERE id = ?",[id],
				null, errorHandler);
		});
	},
	readAll: function(success) {
		db.transaction(function (transaction) {
			var sqlString = "SELECT * FROM event "
				+ "JOIN user_course"
				+ "ON event.id = user_course.course_id "
				+ "WHERE user_id = ? ORDER BY due_date ASC;";

			transaction.executeSql(sqlString, [user.getCurrent().id],
				success, errorHandler);
		});
	},
	nuke: function() {
		db.transaction(function(transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS event", [], Event.initialize, errorHandler);
		}, errorHandler);
	}
}