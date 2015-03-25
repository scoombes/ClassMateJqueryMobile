var Course =
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sql = "CREATE TABLE IF NOT EXISTS course ("
				+ "id INTEGER PRIMARY KEY,"
				+ "course_code VARCHAR,"
				+ "section VARCHAR,"
				+ "name DATETIME,"
				+ "semester_id INTEGER,"
				+ "year INTEGER,"
				+ "teacher_name VARCHAR,"
				+ "creator_id INTEGER"
				+ ")"; 

			transaction.executeSql(sql, [], null, errorHandler);

		}, errorHandler);
	},
	insert: function(course_code, section, name, semester_id, year, teacher_name, creator_id) {
		db.transaction(function(transaction) {
			var sql = "INSERT INTO course ("
				+ "course_code,"
				+ "section,"
				+ "name,"
				+ "semester_id,"
				+ "year,"
				+ "teacher_name,"
				+ "creator_id"
				+ ") VALUES (?,?,?,?,?,?,?)";

			transaction.executeSql(sql, [course_code, section, name, semester_id, year, teacher_name, creator_id], null, errorHandler);
		}, errorHandler);
	}, 
	nuke: function() {
		db.transaction(function(transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS course", [], Course.initialize, errorHandler);
		}, errorHandler);
	}
}