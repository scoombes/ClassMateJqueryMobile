var Event_Type = 
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS event_type ("
				+ "type_id INTEGER NOT NULL PRIMARY KEY,"
				+ "type_name VARCHAR(20) NOT NULL);";
			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(type_name) {
		db.transaction(function(transaction) {
			var sqlString = "INSERT INTO event_type (type_name) VALUES (?);";
			transaction.executeSql(sqlString, [type_name], null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function(transaction) {
			var sqlString = "DROP TABLE IF EXISTS event_type;";
			transaction.executeSql(sqlString, [type_name], null, errorHandler);
		}, errorHandler);
	}
};