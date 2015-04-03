var Event =
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sql = "CREATE TABLE IF NOT EXISTS event ("
				+ "id INTEGER PRIMARY KEY,"
				+ "course_id VARCHAR NOT NULL,"
				+ "event_type INTEGER NOT NULL,"
				+ "name VARCHAR NOT NULL,"
				+ "due_date DATE NOT NULL,"
				+ "time VARCHAR,"
				+ "final_grade_weight INTEGER,"
				+ "description VARCHAR,"
				+ "creator_id INTEGER"
				+ ")"; 

			transaction.executeSql(sql, [], null, errorHandler);

		}, errorHandler);
	},
	insert: function(course_id, event_type, name, due_date, time, final_grade_weight, description, creator_id) {
		db.transaction(function(transaction) {
			var sql = "INSERT INTO event ("
				+ "course_id,"
				+ "event_type,"
				+ "name,"
				+ "due_date,"
				+ "time,"
				+ "final_grade_weight,"
				+ "description,"
				+ "creator_id"
				+ ") VALUES (?,?,?,?,?,?,?,?)";

			transaction.executeSql(sql, [course_id, event_type, name, due_date, time, final_grade_weight, description, creator_id],
			 function (transaction, resultSet){
			 	$.mobile.changePage("event-feed.html", {transition: "none"});
			 }, errorHandler);
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