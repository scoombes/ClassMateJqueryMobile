/* user.js
 *	table that holds all user information
 *
 * 		Sean Coombes - 3/25/15 js file created
 */ 
var User =
{
	initialize: function() {
		db.transaction(function (transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS user ("
			+ " id INTEGER NOT NULL PRIMARY KEY,"
			+ " student_email VARCHAR NOT NULL,"
			+ " password VARCHAR NOT NULL,"
			+ " first_name VARCHAR NOT NULL,"
			+ " last_name VARCHAR NOT NULL)";

			transaction.executeSql(sqlString, [], null, errorHandler);
		});
	},
	insert: function(email, password, first_name, last_name) {
		db.transaction(function (transaction){
			transaction.executeSql("INSERT INTO user (student_email, password, first_name, last_name) "
				+ "VALUES (?, ?, ?, ?)",[email, password, first_name, last_name], null, errorHandler);
		});
	},
	register: function(email, password, first_name, last_name){
		db.transaction(function (transaction){
			transaction.executeSql("SELECT * FROM user WHERE student_email = ?",[email],
				function (transaction, resultset){
					if (resultset.rows.length == 0) 
					{
						User.insert(email, password, first_name, last_name);
						$("#loginmessage").text("Account created, login to authenticate");
						$.mobile.changePage("login.html", {transition: "none"});
						event.preventDefault();
					}
					else
					{
						//needs to alert the user that the email address is already in use 
					}
				}, errorHandler);
		});
	},
	login: function (email, password){
		db.transaction(function (transaction){
			transaction.executeSql("Select * FROM user where student_email = ?", [email],
				function (transaction, resultset){
					if (resultset.rows.length == 1) 
					{
						var row = resultset.rows.item(0);
						if (row["student_email"] == email && row["password"] == password) 
						{
							localStorage.setItem("uid", row["id"]);
							localStorage.setItem("uname", row["first_name"] + " " + row["last_name"]);
							if ($("#remember").prop("checked", true)) 
							{
								localStorage.setItem("rem", "true");
							}
							$.mobile.changePage("event-feed.html", {transition: "none"});
						}
						else
						{
							$("#loginmessage").text("Incorrect username or password please try again");
						}
					}
					else
					{
						$("#loginmessage").text("Incorrect username or password please try again");
					}
				},errorHandler)
		})
	},
	read: function(id){
		db.transaction(function (transaction) {
			transaction.executeSql("SELECT * FROM user WHERE id = ?",[id],
				null, errorHandler);
		});
	},
	nuke: function() {
		db.transaction(function (transaction) {
			transaction.executeSql("DROP TABLE IF EXISTS user",[], 
				User.initialize, errorHandler);
		});
	}
}