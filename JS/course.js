/* course.js
 *		Creates the course object
 *
 * 		Kyle Zimmerman - 3/25/15 js file created
 */
var CourseObject = Parse.Object.extend("Course");

var Course =
{
	//Creates the course table
	initialize: function() {
		// db.transaction(function(transaction) {
		// 	var sql = "CREATE TABLE IF NOT EXISTS course ("
		// 		+ "id INTEGER PRIMARY KEY,"
		// 		+ "course_code VARCHAR NOT NULL,"
		// 		+ "section VARCHAR NOT NULL,"
		// 		+ "name VARCHAR NOT NULL,"
		// 		+ "semester_id INTEGER NOT NULL,"
		// 		+ "year INTEGER NOT NULL,"
		// 		+ "teacher_name VARCHAR,"
		// 		+ "creator_id INTEGER"
		// 		+ ")"; 

		// 	transaction.executeSql(sql, [], null, errorHandler);

		// }, errorHandler);
	},
	//Allows a course to be inserted into the database. Note: validate the values before calling the function
	insert: function(course_code, section, name, semester_id, year, teacher_name, creator_id, successCallback) {
		var course = new CourseObject();
		course.set('courseCode', course_code);
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
		// db.transaction(function(transaction) {
		// 	var sql = "SELECT * FROM course "
		// 		+ "JOIN user_course "
		// 		+ "ON course.id = user_course.course_id "
		// 		+ "JOIN semester ON semester.semester_id = course.semester_id "
		// 		+ "WHERE user_course.user_id = ? "
		// 		+ "ORDER BY course_code DESC";
		// 	transaction.executeSql(sql, [userId], successCallback, errorHandler);
		// }, errorHandler);

		var query = new Parse.Query(CourseObject);
		query.equalTo('members', user);
		query.find().then(successCallback, parseErrorHandler);
	},
	//Gets all of the courses
	readAll: function(successCallback) {
		var query = new Parse.Query(CourseObject);
		query.descending("courseCode");
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
	//Populates the <select> menu on the Add-Event screen
	populateList: function(){
		db.transaction(function(transaction){
			transaction.executeSql("SELECT * FROM course ORDER BY course_code COLLATE NOCASE DESC",[],
				function(transaction, resultSet){
					var row;
					var options = '<option selected="selected" value="">Select a course</option>';
					for (var i = resultSet.rows.length - 1; i >= 0; i--) 
					{
						row = resultSet.rows.item(i);
						options += '<option value="' + row.id + '">'
							+ row.course_code
							+ '</option>';
					}
					$("#eventcourse").html(options);
					$("#eventcourse").selectmenu("refresh");
				}, errorHandler);
		});
	},
	//Drops the table and re-initializes it.
	nuke: function() {
		db.transaction(function(transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS course", [], Course.initialize, errorHandler);
		}, errorHandler);
	}
}