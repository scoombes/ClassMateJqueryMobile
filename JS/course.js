var Course =
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sql = "CREATE TABLE IF NOT EXISTS course ("
				+ "id INTEGER PRIMARY KEY,"
				+ "course_code VARCHAR NOT NULL,"
				+ "section VARCHAR NOT NULL,"
				+ "name VARCHAR NOT NULL,"
				+ "semester_id INTEGER NOT NULL,"
				+ "year INTEGER NOT NULL,"
				+ "teacher_name VARCHAR,"
				+ "creator_id INTEGER"
				+ ")"; 

			transaction.executeSql(sql, [], null, errorHandler);

		}, errorHandler);
	},
	insert: function(course_code, section, name, semester_id, year, teacher_name, creator_id, successCallback) {
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

			transaction.executeSql(sql, [course_code, section, name, semester_id, year, teacher_name, creator_id], successCallback, errorHandler);
		}, errorHandler);
	},
	readJoined: function(userId, successCallback) {
		db.transaction(function(transaction) {
			var sql = "SELECT * FROM course "
				+ "JOIN user_course "
				+ "ON course.id = user_course.course_id "
				+ "JOIN semester ON course.semester_id = semester.id "
				+ "WHERE user_course.user_id = ? "
				+ "ORDER BY course_code DESC";
			transaction.executeSql(sql, [userId], successCallback, errorHandler);
		}, errorHandler);
	},
	readAll: function(successCallback) {
		db.transaction(function(transaction) {
			var sql = "SELECT * FROM course ORDER BY course_code DESC";

			transaction.executeSql(sql, [], successCallback, errorHandler);
		}, errorHandler);
	},
	getCourse: function(id){
		db.transaction(function(transaction){
			transaction.executeSql("SELECT * FROM course WHERE id = ?", [id],
				function (transaction, result)
				{
				    var code = result.rows.item(0)["course_code"];
				    var section = result.rows.item(0)["section"];
				    localStorage.setItem("cc", code);
				    localStorage.setItem("sec", section);
				}, errorHandler);
		});
	},
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
				}, errorHandler);
		});
	},
	nuke: function() {
		db.transaction(function(transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS course", [], Course.initialize, errorHandler);
		}, errorHandler);
	}
}