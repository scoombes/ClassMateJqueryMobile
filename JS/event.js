/* event.js
 *		Helper to allow access to the Event Database table
 *
 * 		Kyle Zimmerman - 3/25/15 js file created
 */
var EventObject = Parse.Object.extend("Event");
var Event =
{
	//Inserts a course into the database. Note: Validation should be done before calling this function
	insert: function(course_id, event_type, name, due_date, time, final_grade_weight, description, creator_id) {
		var event = new EventObject();
		event.set(course: course_id);
		event.set(eventType: event_type);
		event.set(name: name);
		var dueDate = new Date(due_date + " " + time + ":00");
		event.set(dueDate: dueDate);
		event.set(final_grade_weight);
		event.set(description);
		event.set(creator_id);

		event.save().then(function () {
			$.mobile.changePage("event-feed.html", {transition: "none"});
		}, parseErrorHandler);
	}, 
	//Gets a specific event by ID
	read: function (id, successCallBack) {

		var eventQuery = new Parse.Object.Query(EventObject);
		var eventVotes = {};

		eventQuery.get(id).then(function(event) {
			var voteQuery = new Parse.Object.Query(VoteObject);
			eventVotes.event = event;
			return voteQuery.greaterThan("value", 0).count();
		}).then(function (upvotes) {
			eventVotes.upvotes = upvotes;
			return voteQuery.lessThan("value", 0).count();
		}).then( function (downvotes) {
			eventVotes.downvotes = downvotes;
			successCallback(eventVotes);
		});
	},
	//Gets all of the events for a specific course
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
	//Gets ALL of the events that the current user can see
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
	//Drop and re-init the table
	nuke: function() {

		db.transaction(function(transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS event", [], Event.initialize, errorHandler);
		}, errorHandler);
	}
}