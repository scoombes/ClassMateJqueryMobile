var Post = 
{
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS post ("
				+ "id INTEGER NOT NULL PRIMARY KEY,"
				+ "title VARCHAR NOT NULL,"
				+ "body VARCHAR NOT NULL,"
				+ "author INTEGER NOT NULL"
				+ "postDateTime DATETIME NOT NULL);";
			transaction.executeSql(sqlString, [], null, errorHandler);
		}, errorHandler);
	},
	insert: function(title, body, author, postDateTime) {
		db.transaction(function(transaction) {
			var sqlString = "INSERT INTO post (title, body, author, postDateTime) VALUES (?, ?, ?, ?);";
			transaction.executeSql(sqlString, [title, body, author, postDateTime], null, errorHandler);
		}, errorHandler);
	},
	nuke: function() {
		db.transaction(function(transaction) {
			var sqlString = "DROP TABEL IF EXISTS post;";
			transaction.executeSql(sqlString, [], Post.initialize, errorHandler);
		}, errorHandler);
	}
};