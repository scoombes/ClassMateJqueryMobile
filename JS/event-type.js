/* event-type.js
 *		Creates the event-type lookup table
 *
 * 		Justin Coschi - 3/25/15 js file created
 */
 var EventTypeObject = Parse.Object.extend("EventType");
var EventType = 
{
	//Initialize the event_type table and seed it with values
	initialize: function() {
		db.transaction(function(transaction) {
			var sqlString = "CREATE TABLE IF NOT EXISTS event_type ("
				+ "id INTEGER NOT NULL PRIMARY KEY,"
				+ "type_name VARCHAR(20) NOT NULL);";

			transaction.executeSql(sqlString, [], null, errorHandler);

			//Check if the table is empty, if it is seed it with inital types
			transaction.executeSql("SELECT * FROM event_type", [], function(transaction, resultset) {
				if (resultset.rows.length == 0) {
					EventType.insert("Assignment");
					EventType.insert("Test");
					EventType.insert("Exam");
				}
			}, errorHandler);
			
		}, errorHandler);
	},
	//Inserts a new event type by name
	insert: function(type_name) {
		var eventType = new EventTypeObject();
		eventType.set("typeName", type_name);
		eventType.save();
	},
	getEventType: function (event_type_id) {
		var query = new Parse.Query(EventTypeObject);
		return query.get(event_type_id);
	},
	//Drops the event_type table and recreates it.
	nuke: function() {
		db.transaction(function(transaction) {
			var sqlString = "DROP TABLE IF EXISTS event_type;";
			transaction.executeSql(sqlString, [], EventType.initialize, errorHandler);
		}, errorHandler);
	}
};