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
		if (time == "") {
			time = "00:00";
		}
		var dueDate = new Date(due_date + " " + time + ":00");
		event.set("dueDate", dueDate);
		event.set("finalGradeWeight", parseInt(final_grade_weight));
		event.set("description", description);
		event.set("creator", User.getCurrent());
		event.save().then(function () {
			return Course.getCoursePromise(course_id);
		}).then(function (course) {
			var message = "Event '" +  + "' added to " + course.get("courseCode");
			Push.send(message, course_id);
			$.mobile.changePage("event-feed.html", {transition: "none"});
		}, parseErrorHandler);
	}, 
	//Gets a specific event by ID
	read: function (id, successCallback) {
		var query = new Parse.Query(EventObject);
		query.get(id).then( function (event) {
			successCallback(event);
		});
	},
	//Gets all of the events for a specific course
	getEventsForCourse: function(course_id, successCallback) {
		var query = new Parse.Query(EventObject);
		var eventsForCourse = [];

		Course.getCoursePromise(course_id).then(function (course) {
			query.equalTo("course", course);
			query.include('course');
			query.include('course.semester');
			return query.find();
		}).then(successCallback, parseErrorHandler);
	},
	//Gets ALL of the events that the current user can see
	getAll: function(successCallback) {
		var userCourseQuery = new Parse.Query(CourseObject);
		userCourseQuery.equalTo('members', Parse.User.current());

		var query = new Parse.Query(EventObject);
		query.include('course').matchesQuery('course', userCourseQuery).ascending('dueDate').find().then(successCallback, parseErrorHandler);
	},
	vote: function(event_id, value, successCallback) {
		var hadUpvoted = false;
		var hadDownvoted = false;

		Event.read(event_id, function(event) {
			var ups = event.relation('upvoters').query();
			ups.equalTo("objectId", Parse.User.current().id);

			var downs = event.relation('downvoters').query();
			downs.equalTo("objectId", Parse.User.current().id);

			ups.count().then(function(upCount) {
				hadUpvoted = upCount > 0;
				return downs.count();
			}).then(function(downCount) {
				hadDownvoted = downCount > 0;

				if (hadUpvoted || hadDownvoted) {
					if (!hadDownvoted && hadUpvoted && value < 0) {
						//Remove upvote, add downvote
						event.increment('upvotes', -1);
						event.increment('downvotes');
						event.relation('upvoters').remove(Parse.User.current());
						event.relation('downvoters').add(Parse.User.current());
						event.save();
					} else if (!hadUpvoted && hadDownvoted && value > 0) {
						//Remove downvote, add upvote
						event.increment('upvotes');
						event.increment('downvotes', -1);
						event.relation('upvoters').add(Parse.User.current());
						event.relation('downvoters').remove(Parse.User.current());
						event.save();
					}
				} else {
					if (value > 0) {
						//Add new upvote
						event.increment('upvotes');
						event.relation('upvoters').add(Parse.User.current());
						event.save();
					} else if (value < 0) {
						//Add new downvote
						event.increment('downvotes');
						event.relation('downvoters').add(Parse.User.current());
						event.save();
					}
				}
			});
		});
	}
};