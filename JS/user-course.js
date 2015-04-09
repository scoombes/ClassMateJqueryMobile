/* user-course.js
 *	intersection table for course and users
 *
 * 		Sean Coombes - 3/25/15 js file created
 */ 
var UserCourse =
{
	//Creates the tale if required
	initialize: function() {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS user_course ("
			+ " course_id INTEGER NOT NULL,"
			+ " user_id INTEGER NOT NULL,"
			+ " PRIMARY KEY (course_id, user_id))";

			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	//Inserts a new User <-> Course relationship (Many-to-Many)
	insert: function(user_id, course_id, successCallback, errorCallback) {
		db.transaction(function (transaction)
		{
			transaction.executeSql("INSERT INTO user_course (course_id, user_id) "
				+ "VALUES (?, ?)",
				[course_id, user_id],
				successCallback,
				errorCallback || errorHandler);
			
		},errorHandler);
		Course.getCourse(course_id, function(course) {
			course.relation('members').add(Parse.User.current());
			course.save().then(successCallback, errorCallback);
		})
	},
	//Drop the table and re-initialize it
	nuke: function() {
		db.transaction(function (transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS user_course",[], 
				UserCourse.initialize, errorHandler);
		}, errorHandler);
	}
}