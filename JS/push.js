// document.addEventListener('deviceready', function() {
// 	var appID = "YstnFpcnRNYfA35BEVOF84uAScfrhfO7Qw05Y2pU";
// 	var clientKey = "TyI6sYmPBzgWWT6UMvAucWhTcLevnfkUVhsGFjFW";
// 	var eventkey = "myEventKey";


// 	alert('registering');

// 	parsePlugin.initialize(appID, clientKey, function() {
// 		alert('success');
// 	}, function(e) {
// 		alert('error registering device: ' + e);
// 	});
// }, false);

// function getInstallation() {
// 	ParsePushPlugin.getInstallationId(function(id) {
//         alert(id);
//         subscribe();
//     }, function(e) {
//         alert('error');
//     });
// }

// function subscribe() {
// 	ParsePushPlugin.subscribe('SampleChannel', function(msg) {
//         alert('OK');
//         listSubscriptions();
//     }, function(e) {
//         alert('error');
//     });
// }

// function listSubscriptions() {
// 	ParsePushPlugin.getSubscriptions(function(subscriptions) {
//         alert(subscriptions);
//     }, function(e) {
//         alert('error');
//     });
// }

document.addEventListener('deviceready', function() {
	var appID = "YstnFpcnRNYfA35BEVOF84uAScfrhfO7Qw05Y2pU";
	var clientKey = "TyI6sYmPBzgWWT6UMvAucWhTcLevnfkUVhsGFjFW";
	var eventkey = "myEventKey";


	alert('registering');

	ParsePushPlugin.register({
		appId: appID,
		clientKey: clientKey,
		eventKey: eventkey
	}, function() {
		alert('success');
		getInstallation();
	}, function(e) {
		alert('error registering device: ' + e);
	});
}, false);

function getInstallation() {
	ParsePushPlugin.getInstallationId(function(id) {
        alert(id);
        subscribe();
    }, function(e) {
        alert('error');
    });
}

function subscribe() {
	ParsePushPlugin.subscribe('SampleChannel', function(msg) {
        alert('OK');
        listSubscriptions();
    }, function(e) {
        alert('error');
    });
}

function listSubscriptions() {
	ParsePushPlugin.getSubscriptions(function(subscriptions) {
        alert(subscriptions);
    }, function(e) {
        alert('error');
    });
}