/* semester.js
 *		Creates the semester lookup table
 *
 * 		Justin Coschi - 3/25/15 js file created
 */
 var SemesterObject = Parse.Object.extend("Semester")
var Semester = 
{
	//Create the table if required
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS semester ("
				+ "semester_id INTEGER NOT NULL PRIMARY KEY,"
				+ "semester_name VARCHAR(10) NOT NULL);";

			transaction.executeSql(sqlString, [], null, errorHandler);

			//If the table is empty, seed some values
			transaction.executeSql("SELECT * FROM semester", [], function(transaction, resultset) {
				if (resultset.rows.length === 0) {
					Semester.insert("Fall");
					Semester.insert("Winter");
					Semester.insert("Spring");
				}
			}, errorHandler);

		}, errorHandler);
	},
	//Add a new semester
	insert: function(semester_name) {
		var semester = new SemesterObject();
		semester.set("semesterName", semester_name);
		semester.save();
	},
	//Drop and reinitialize the table
	nuke: function() {
		db.transaction(function(transaction) {
			var sqlString = "DROP TABLE IF EXISTS semester;";
			transaction.executeSql(sqlString, [], Semester.initialize, errorHandler);
		}, errorHandler);
	}
};