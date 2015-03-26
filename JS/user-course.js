/* user-course.js
 *	intersection table fort course and users
 *
 * 		Sean Coombes - 3/25/15 js file created
 */ 
var UserCourse =
{
	initialize: function() {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS user_course ("
			+ " course_id INTEGER NOT NULL,"
			+ " user_id INTEGER NOT NULL)";

			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(course_id, user_id) {
		dv.transaction(function (transaction)
		{
			transaction.executeSql("INSERT INTO user_course (course_id, user_id) "
				+ "VALUES (?, ?)",[course_id, user_id], null, errorHandler);
		},errorHandler);
	},
	nuke: function() {
		db.transaction(function (transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS user_course",[], 
				UserCourse.initialize, errorHandler);
		}, errorHandler);
	}
}