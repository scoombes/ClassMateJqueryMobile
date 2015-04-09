/* event.js
 *		Helper to allow access to the Event Database table
 *
 * 		Kyle Zimmerman - 3/25/15 js file created
 */
var EventObject = Parse.Object.extend("Event");
var Event =
{
	//Inserts a course into the database. Note: Validation should be done before calling this function
	insert: function(course_id, event_type, name, due_date, time, final_grade_weight, description) {
		var event = new EventObject();

		event.set("course", CourseObject.createWithoutData(course_id));
		event.set("eventType", EventTypeObject.createWithoutData(event_type));
		event.set("name", name);
		var dueDate = new Date(due_date + " " + time + ":00");
		event.set("dueDate", dueDate);
		event.set("finalGradeWeight", final_grade_weight);
		event.set("description", description);
		event.set("creator", User.getCurrent());
		event.save().then(function () {
			$.mobile.changePage("event-feed.html", {transition: "none"});
		}, parseErrorHandler);
	}, 
	//Gets a specific event by ID
	read: function (id, successCallBack) {
		var query = new Parse.Query(EventObject);
		var eventVotes = {};

		query.get(id).then(function(event) {
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
	getEventsForCourse: function(course_id, successCallback) {
		var query = new Parse.Query(EventObject);
		var eventsForCourse = [];

		Course.getCoursePromise(course_id).then(function (course) {
			query.equalTo("course", course);
			return query.find();
		}).then(successCallback, parseErrorHandler);
	},
	//Gets ALL of the events that the current user can see
	getAll: function(successCallback) {
		var query = new Parse.Query(EventObject);
		query.include('course').find().then(successCallback, parseErrorHandler);
	},
	vote: function(event_id, value, successCallback) {
		Event.get(event_id, function(event) {
			if (value > 0) {
				event.increment('upvotes');
			} else {
				event.increment('downvotes');
			}
		});
	},
	//Drop and re-init the table
	nuke: function() {

		/*
		db.transaction(function(transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS event", [], Event.initialize, errorHandler);
		}, errorHandler);*/
	}
}