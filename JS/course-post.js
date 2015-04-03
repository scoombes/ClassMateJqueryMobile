/* course-post.js
 *	intersection table fort course and posts
 *
 * 		Sean Coombes - 3/25/15 js file created
 */ 
var CoursePost =
{
	initialize: function() {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS course_post ("
			+ " course_id INTEGER NOT NULL,"
			+ " post_id INTEGER NOT NULL)";

			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(course_id, post_id) {
		db.transaction(function (transaction)
		{
			transaction.executeSql("INSERT INTO course_post (course_id, post_id) "
				+ "VALUES (?, ?)",[course_id, post_id], null, errorHandler);
		},errorHandler);
	},
	nuke: function() {
		db.transaction(function (transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS course_post",[], 
				CoursePost.initialize, errorHandler);
		}, errorHandler);
	}
}