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
	read: function (id) {
		db.transaction(function (transaction) {
			transaction.executeSql("SELECT * FROM event WHERE id = ?",[id],
				function(transaction, result)
				{
				    $("#details-name").text(result.rows.item(0)["name"] + " Details");
				    $("#details-due").text(result.rows.item(0)["due_date"]);

				    if (result.rows.item(0)["final_grade_weight"] != "")
				    {
				        $("#detail-grade-parent").removeClass("hidden");
				        $("#details-grade").text(result.rows.item(0)["final_grade_weight"]);
				    }
				    else
				    {
				        $("#detail-grade-parent").addClass("hidden");
				        $("#details-grade").text("");
				    }

				    if (result.rows.item(0)["description"] != "")
				    {
				        $("#detail-description-parent").removeClass("hidden");
				        $("#details-description").text(result.rows.item(0)["description"]);
				    }
				    else
				    {
				        $("#detail-description-parent").addClass("hidden");
				        $("#details-description").text("");
				    }
				    
				}, errorHandler);
		});
	},
	getEventsForCourse: function(courseId, successCallback) {
		db.transaction(function(transaction) {
			var sql = "SELECT *, event.id AS event_id, event.name AS name  FROM event "
					+ "JOIN course ON event.course_id = course.id "
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
				+ "JOIN (SELECT COUNT(value) AS count FROM vote WHERE vote.event_id = event_id AND value > 0) AS upvotes "
				+ "JOIN (SELECT COUNT(value) AS count FROM vote WHERE vote.event_id = event_id AND value < 0) AS downvotes "
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

function aname() {
	
}