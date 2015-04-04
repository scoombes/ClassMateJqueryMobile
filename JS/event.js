var Event =
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sql = "CREATE TABLE IF NOT EXISTS event ("
				+ "id INTEGER PRIMARY KEY,"
				+ "course_id INTEGER NOT NULL,"
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
	read: function (id, successCallBack) {
		db.transaction(function (transaction) {
			var sql = "SELECT *, upvotes.count AS upvotes, downvotes.count as downvotes FROM event "
					+ "LEFT OUTER JOIN (SELECT COUNT(value) AS count, vote.event_id AS event_id2 FROM vote WHERE value > 0 GROUP BY event_id2) AS upvotes ON upvotes.event_id2 = ? "
					+ "LEFT OUTER JOIN (SELECT COUNT(value) AS count, vote.event_id AS event_id2 FROM vote WHERE value < 0 GROUP BY event_id2) AS downvotes ON downvotes.event_id2 = ? "
					+ " WHERE id = ?";
					
			transaction.executeSql(sql, [id, id, id], successCallBack, errorHandler);
		});
	},
	getEventsForCourse: function(courseId, successCallback) {
		db.transaction(function(transaction) {
			var sql = "SELECT *, event.id AS event_id, event.name AS name, upvotes.count AS upvotes, downvotes.count AS downvotes FROM event "
					+ "JOIN course ON event.course_id = course.id "
					+ "LEFT OUTER JOIN (SELECT COUNT(value) AS count, vote.event_id AS event_id2 FROM vote WHERE value > 0 GROUP BY event_id2) AS upvotes ON upvotes.event_id2 = event_id "
					+ "LEFT OUTER JOIN (SELECT COUNT(value) AS count, vote.event_id AS event_id2 FROM vote WHERE value < 0 GROUP BY event_id2) AS downvotes ON downvotes.event_id2 = event_id "
					+ "WHERE course_id = ? "
					+ "ORDER BY due_date ASC";

			transaction.executeSql(sql, [courseId], successCallback, errorHandler);
		});
	},
	getAll: function(displayEvents) {
		db.transaction(function (transaction) {
			var sqlString = "SELECT *, event.id AS event_id, event.name AS name, upvotes.count AS upvotes, downvotes.count AS downvotes FROM event "
				+ "JOIN user_course ON event.course_id = user_course.course_id "
				+ "JOIN course ON event.course_id = course.id "
				+ "LEFT OUTER JOIN (SELECT COUNT(value) AS count, vote.event_id AS event_id2 FROM vote WHERE value > 0 GROUP BY event_id2) AS upvotes ON upvotes.event_id2 = event_id "
				+ "LEFT OUTER JOIN (SELECT COUNT(value) AS count, vote.event_id AS event_id2 FROM vote WHERE value < 0 GROUP BY event_id2) AS downvotes ON downvotes.event_id2 = event_id "
				+ "WHERE user_course.user_id = ? "
			    + "ORDER BY due_date ASC";

			transaction.executeSql(sqlString, [User.getCurrent().id],
				displayEvents, errorHandler);
		});
	},
	nuke: function() {
		db.transaction(function(transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS event", [], Event.initialize, errorHandler);
		}, errorHandler);
	}
}