/* course.js
 *		Creates the course object
 *
 * 		Kyle Zimmerman - 3/25/15 js file created
 */
var CourseObject = Parse.Object.extend("Course");

var Course =
{
	//Allows a course to be inserted into the database. Note: validate the values before calling the function
	insert: function(course_code, section, name, semester_id, year, teacher_name, creator_id, successCallback) {
		var course = new CourseObject();
		course.set('courseCode', course_code.toUpperCase());
		course.set('section', section);
		course.set('name', name);
		course.set('semester', SemesterObject.createWithoutData(semester_id));
		course.set('year', parseInt(year));
		course.set('teacherName', teacher_name);
		course.set(Parse.User.current());
		course.relation('members').add(Parse.User.current());

		course.save().then(successCallback, parseErrorHandler);
	},
	//get all of the courses the provided user has joined
	readJoined: function(user, successCallback) {
		var query = new Parse.Query(CourseObject);
		query.equalTo('members', user);
		query.include('semester');
		query.find().then(successCallback, parseErrorHandler);
	},
	//Gets all of the courses
	readAll: function(successCallback) {
		var query = new Parse.Query(CourseObject);
		query.descending("courseCode");
		query.include('semester');
		query.find().then(successCallback, parseErrorHandler);
	},
	//Gets a specific course by ID
	getCourse: function(id, successCallback){
		Course.getCoursePromise(id).then(successCallback, parseErrorHandler);
	},
	getCoursePromise: function (id) {
		var query = new Parse.Query(CourseObject);
		return query.get(id);
	},
	join: function(id, successCallback, errorCallback) {
		Course.getCourse(id, function(course) {
			course.relation('members').add(Parse.User.current());
			 course.save().then(successCallback, errorCallback);
		});
	},
	drop: function(id, successCallback, errorCallback) {
		Course.getCourse(id, function(course) {
			course.relation('members').remove(Parse.User.current());
			 course.save().then(successCallback, errorCallback);
		});	
	}
}