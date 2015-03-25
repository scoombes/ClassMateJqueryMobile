var Post = 
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS post ("
				+ "post_id INTEGER NOT NULL PRIMARY KEY,"
				+ "title VARCHAR NOT NULL,"
				+ "body VARCHAR NOT NULL,"
				+ "author INTEGER NOT NULL"
				+ "postDateTime DATETIME NOT NULL"
				+ ");";
			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(semester_name) {
		db.transaction(function(transaction) {
			var sqlString = "INSERT INTO post (semester_name) VALUES (?);";
			transaction.executeSql(sqlString, [semester_name], null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function(transaction) {
			var sqlString = "DELETE FROM post WHERE post=?;";
			transaction.executeSql(sqlString, [semester_name], Semester.initialize, errorHandler);
		}, errorHandler);
	}
};