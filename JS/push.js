document.addEventListener('deviceready', function() {
	var appID = "YstnFpcnRNYfA35BEVOF84uAScfrhfO7Qw05Y2pU";
	var clientKey = "TyI6sYmPBzgWWT6UMvAucWhTcLevnfkUVhsGFjFW";
	var eventkey = "myEventKey";

	ParsePushPlugin.register({
		appId: appID,
		clientKey: clientKey,
		eventKey: eventkey
	}, function() {
		Push.subscribe('all');
	}, function(e) {
		alert('Error Registering Device: ' + e);
	});
}, false);

var Push = {
	subscribe: function(channelName, success, error) {
		ParsePushPlugin.subscribe(channelName, success, error);
	},
	unsubscribe: function(channelName, success, error) {
		ParsePushPlugin.unsubscribe(channelName, success, error);
	},
	send: function(message, channel) {
		return Parse.Push.send({
			channels: [channel],
			data: {
				alert: message
			}
		});
	},
	sendNotification: function (message, channel, due_date) {
		var pushDate = new Date(due_date);
		pushDate.setDate(pushDate.getDate() - 1);
		return Parse.Push.send({
			channels: [channel],
			data: {
				alert: message
			},
			push_time:  pushDate
		});
	}
};