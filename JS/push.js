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
	send: function(data, channel) {
		return Parse.Push.send({
			chennels: [channel],
			data: message
		});
	}
};