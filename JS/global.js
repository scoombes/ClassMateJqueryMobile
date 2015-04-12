/* global.js
 *	    File contains most functions needed for project to run
 *
 * 		Sean Coombes, Kyle Zimmerman, Justin Coschi  - 3/20/15 js file created
 */

var SemesterObject = Parse.Object.extend("Semester");
var EventTypeObject = Parse.Object.extend("EventType");

//runs before each pages loads and sets up click events 
$(document).on("pagecontainerbeforeshow", function (event, ui) {
	Parse.initialize("YstnFpcnRNYfA35BEVOF84uAScfrhfO7Qw05Y2pU", "mUVdZeAXnV4A8NGi2av5YuUVJublH8JTwYOmKSKL");
	var activepage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;

    if (User.getCurrent() || activepage == "login") {
        
        checkPage(activepage);
    }
    else {
        $.mobile.changePage("login.html", { transition: "none" });
    }	

	$("#signupbtn").on("click", function(event) {$.mobile.changePage("register.html", {transition: "none"}); event.preventDefault(); });
	$("#up-vote").on("click", setVote);
	$("#down-vote").on("click", setVote);
	$("#logout-button").on("click", function (){User.logout()});
	$("#add-course-form").hide();
	$("#toggle-create-course").on("click", toggleCreateCourse);
	$("#drop-course").on("click", dropCourse);

	$.mobile.defaultPageTransition = 'none';
});

//called every page load and executes case depending on page loaded
function checkPage(activepage)
{
	switch(activepage)
	{
	    case "login":
	        checkLogInState();
			loginValidations();
			break;
		case "register":
			registerValidations();
			break;
		case "add-course":
			Course.readAll(handleAddCoursesLoadExisting);
			addCourseValidations();
			break;
		case "courses":
			Course.readJoined(Parse.User.current(), handleCoursesLoad);
			break;
		case "course-detail":
			var parameters = document.URL.split("?")[1];
			course_id = parameters.replace("course_id=","");
			Course.getCourse(course_id, handleCourseDetail);
			break;
		case "createevent":
			createEventValidations();
			Course.readJoined(Parse.User.current(), populateCourseList);
			break;
		case "eventfeed":
			Event.getAll(handleEventFeed);
			break;
		case "eventdetails":
			eventFeedDetailsSetup();
			break;
		default:
			break;
	}
}

//populates course drop-down when creating an event
function populateCourseList(courses) {
    var options = '<option selected="selected" value="">Select a course</option>';
    $("#create-event").trigger("reset");
	for (var i = courses.length - 1; i >= 0; i--) 
	{
		options += '<option value="' + courses[i].id + '">'
			+ courses[i].get("courseCode");
			+ '</option>';
	}
	$("#eventcourse").html(options);
	$("#eventcourse").selectmenu("refresh");
}

//handles errors for parse
function parseErrorHandler(error) {
    var msg = "PARSE ERROR (" + error.code + ": " + error.message;
    console.log(msg);
    alert(msg);
}

//prepares data to be displayed on eventdetails page
function eventFeedDetailsSetup()
{
	
	var parameters = document.URL.split('?')[1].split('&');
	var paramValue = [];

	for (var i = 0; i < parameters.length; i++)
	{
		paramValue.push(parameters[i].split('=')[1]);
	}

	event_id = paramValue[0];
	event_cc_sec = paramValue[1];
	event_c_id = paramValue[2];
	
	Event.read(event_id, function(result)
	{
		$("#detail-course").text(event_cc_sec);
		$("#detail-course").prop("href", "course-details.html?course_id=" + event_c_id);
		$("#details-name").text(result.get("name") + " Details");
		var dueDate = result.get("dueDate");
		$("#details-due").text(getDate(dueDate));

		$("#up-vote").text(result.get("upvotes") || 0);
		$("#down-vote").text(result.get("downvotes") || 0);

		if (result.get("finalGradeWeight") != "") {
			$("#details-grade-parent").removeClass("hidden");
			$("#details-grade").text(result.get("finalGradeWeight"));
		}
		else {
			$("#details-grade-parent").addClass("hidden");
			$("#details-grade").text("");
		}

		var dueTime = dueDate.toTimeString().substr(0,5);
		if (dueTime != "00:00"){
			$("#details-time-parent").removeClass("hidden");

			$("#details-time").text(formatTime(dueTime));
		}
		else{
			$("#details-time-parent").addClass("hidden");
			$("#details-time").text("");
		}

		if (result.get("description") != "") {
			$("#details-description-parent").removeClass("hidden");
			$("#details-description").text(result.get("description"));
		}
		else {
			$("#details-description-parent").addClass("hidden");
			$("#details-description").text("");
		}

		var upvoteQuery = new Parse.Query(EventObject);
		upvoteQuery.equalTo('objectId', event_id);
		upvoteQuery.equalTo('upvoters', Parse.User.current());

		var downvoteQuery = new Parse.Query(EventObject);
		downvoteQuery.equalTo('objectId', event_id);
		downvoteQuery.equalTo('downvoters', Parse.User.current());

		upvoteQuery.count().then(function (count) {
			if (count > 0) {
				$("#down-vote").removeClass("ui-btn-d");
				$("#up-vote").addClass("ui-btn-c");
			} else {
				return downvoteQuery.count();
			}
		}).then(function (count) {
			if (count > 0) {
				$("#up-vote").removeClass("ui-btn-c");
				$("#down-vote").addClass("ui-btn-d");
			}
		});
	});
}

//formats time to 12hr time from 24hr
function formatTime(eventTime)
{
    var hours = parseInt(eventTime.substr(0, 2));
	var mins = eventTime.substr(3,2);
    var suffix = "am";

    if (hours > 11) {
        suffix = "pm";
    }

    if (hours > 12)
    {
        hours = hours - 12;
    }
    else if (hours == 0)
    {
        hours = 12;
    }

	return hours + ":" + mins + suffix;
}

//prepares existing courses on add course page
function handleAddCoursesLoadExisting(results) {
	var courseList = $('#add-existing-course');
	courseList.empty();
	
	for (var i = 0; i < results.length; i++) {
		var result = results[i];

		var course = {
			id: results[i].id,
			code: results[i].get('courseCode'),
			section: results[i].get('section'),
			name: results[i].get('name'),
			teacherName: results[i].get('teacherName'),
			semester: results[i].get('semester').get('semesterName'),
			year: results[i].get('year')
		};

		var courseElement = $('<li>');

		var link = $('<a>');
		link.attr('data-course-id', course.id);
		link.text(course.code + "-" + course.section + " - " + course.name);

		link.click(addExistingCourse);

		courseElement.append(link);
		courseList.append(courseElement);
	}

	courseList.listview('refresh');
}

//adds user to a class that has already been created
function addExistingCourse() {
	var id = $(this).attr('data-course-id');
	Course.join(id, function() {
		$.mobile.changePage('courses.html'); 
	}, function(error) {
		alert('You are already in that course');
	});
}

function dropCourse() {
	var id = $(this).attr('data-course-id');
	Course.drop(id, function() {
		$.mobile.changePage('courses.html'); 
	}, function(error) {
		alert('You are not in this course');
	});
}

//prepares courses that user is in into a course list
function handleCoursesLoad(results) {
	var courseList = $('.course-list');
	courseList.empty();
	
	for (var i = 0; i < results.length; i++) {
		var course = {
			id: results[i].id,
			code: results[i].get('courseCode'),
			section: results[i].get('section'),
			name: results[i].get('name'),
			teacherName: results[i].get('teacherName'),
			semester: results[i].get('semester').get('semesterName'),
			year: results[i].get('year')
		};

		var courseElement = $('<li>').addClass('eventfeed-item');
		
		var link = $('<a>');
		link.attr('data-course-id', course.id);
		link.click(function() {
			$.mobile.changePage('course-details.html', { data: { 'course_id': $(this).attr('data-course-id') }, reloadPage: true, changeHash: true });
		});

		link.append($('<h1>').addClass('course-code').html(course.code + "-" + course.section));
		link.append($('<h2>').addClass('course-description').text(course.name));
		
		var p = $('<p>');
		p.append($('<span>').addClass('teacher').text(course.teacherName));
		p.append($('<span>').text(' - '));
		p.append($('<span>').addClass('date').text(course.semester + " " + course.year));

		p.appendTo(link);
		link.appendTo(courseElement);
		courseElement.appendTo(courseList);
	};

	courseList.listview('refresh');
}

//prepares and displays details of selected course
function handleCourseDetail(course) {

	$('#course-event-list').empty();
	$('#course-event-list').listview('refresh');

	$('.course-info .course-code').text(course.get('courseCode'));
	$('.course-info .section').text(course.get('section'));
	$('.course-info .course-name').text(course.get('name'));
	$('.course-info .teacher-name').text(course.get('teacherName'));
	var semesterName = "";
	switch (course.get('semester').id) {
		case "rlyjqjgHER":
			semesterName = "Fall";
			break;
		case "kDQaEieXpJ":
			semesterName = "Winter";
			break;
		case "jFVNfnDR5z":
			semesterName = "Spring";
			break;
		default:
			break;
	}
	$('.course-info .semester').text(semesterName);
	$('.course-info .year').text(course.get('year'));
	$('#drop-course').attr('data-course-id', course.id);

	Event.getEventsForCourse(course.id, function(results) {
		for (var i = 0; i < results.length; i++) {
			createEventElement(results[i]).appendTo($('#course-event-list'));
		}

		$('#course-event-list').listview('refresh');
	});
}

//prepares data of events to be used in a list
function handleEventFeed(results) {
    var eventList = $("#event-feed-list");
    eventList.empty();

    for (var i = 0; i < results.length; i++) {
        var eventElement = createEventElement(results[i]);
        eventElement.appendTo(eventList);
    }
    eventList.listview("refresh");
}

//displays all events user has for subscribed courses in a list
function createEventElement(eventItem) {
	var event =
	{
		courseCode: eventItem.get("course").get("courseCode") + "-" + eventItem.get('course').get("section"),
		name: eventItem.get("name"),
		dueDate: eventItem.get("dueDate"),
		id: eventItem.id
	};

	var eventElement = $("<li>").addClass("eventfeed-item");
	
	var display = $("<a>");
	display.attr("event-id", event.id);
	display.attr("event-course-info", event.courseCode);
	display.attr("event-course-id", eventItem.get("course").id);

	display.click(function()
	{
		$.mobile.changePage("event-details.html", {
			data: {
				"event_id": $(this).attr("event-id"),
				"event_cc_sec": $(this).attr("event-course-info"),
				"event_c_id": $(this).attr("event-course-id")
			}, reloadPage: true, changeHash: true
		});
	});

	display.append($("<h3>").addClass("course-name").text(event.courseCode));
	display.append($("<h2>").addClass("assignment-name").text(event.name));
	display.append($("<h3>").addClass("due-date").text(getDate(event.dueDate)));

	var voteBar = $("<div>").addClass("vote-bar");
	voteBar.append($("<div>").addClass("upvote-bar"));
	voteBar.append($("<div>").addClass("downvote-bar"));
	display.append(voteBar);

	var upvotes = eventItem.get("upvotes") || 0;
	var downvotes = eventItem.get("downvotes") || 0;

	var upvotePercent = upvotes / (upvotes + downvotes) * 100;
	var downvotePercent = downvotes / (upvotes + downvotes) * 100;

	display.find('.upvote-bar').css('height', upvotePercent + '%');
	if (upvotes > 0) {
		display.find('.upvote-bar').html('<span>' + upvotes + '</span>');
	}
	display.find('.downvote-bar').css('height', downvotePercent + '%');
	if (downvotes > 0) {
		display.find('.downvote-bar').html('<span>' + downvotes + '</span>');
	}
	display.appendTo(eventElement);

	return eventElement;
}

//formats date from a numerical format into a more easy to read format
function getDate(date)
{
	var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];

	var somedate = new Date(date);

	var year = date.getFullYear();
	var month = monthNames[somedate.getMonth()];
	var weekday = daysOfWeek[somedate.getDay()];

	var day = date.toString().substr(8, 2);

	if (day.substr(0,1) == "0") {
		day = day.substr(1,1);
	}

	return weekday + ", " + month + " " + day + " " + year;
}

//sets the visuals for up-/downvoting and inserts selected vote
function setVote()
{
	var voteWorth;

	if ($(this).prop("id") == "up-vote")
	{
		if ($("#down-vote").hasClass("ui-btn-d")) 
		{
			$("#down-vote").text(parseInt($("#down-vote").text()) - 1);
		}

		if (!$("#up-vote").hasClass("ui-btn-c")) 
		{
			$("#up-vote").text(parseInt($("#up-vote").text()) + 1);
		}

		$("#down-vote").removeClass("ui-btn-d");
		$("#up-vote").addClass("ui-btn-c");

		voteWorth=1;
	}
	else
	{
		if ($("#up-vote").hasClass("ui-btn-c")) 
		{
			$("#up-vote").text(parseInt($("#up-vote").text()) - 1);
		}

		if (!$("#down-vote").hasClass("ui-btn-d"))
		{
			$("#down-vote").text(parseInt($("#down-vote").text()) + 1);
		}

		$("#up-vote").removeClass("ui-btn-c");
		$("#down-vote").addClass("ui-btn-d");

		voteWorth=-1;
	}

	var parameters = document.URL.split('?')[1].split('&');
	var paramValue = [];

	for (var i = 0; i < parameters.length; i++)
	{
		paramValue.push(parameters[i].split('=')[1]);
	}

	var currentEventId = paramValue[0];
	var currentUserId = User.getCurrent().id;

	Event.vote(currentEventId, voteWorth);
}

//callback function to handle when a user has already voted for an event
function userEventVote(transaction, results) {
	if (results.rows.length > 0 && results.rows.item(0).value > 0) {
		$("#down-vote").removeClass("ui-btn-d");
		$("#up-vote").addClass("ui-btn-c");
	} else if (results.rows.length > 0 && results.rows.item(0).value < 0) {
		$("#up-vote").removeClass("ui-btn-c");
		$("#down-vote").addClass("ui-btn-d");
	}
}

//attempts to log user in if form is valid
function handleLoginForm(){
    var username = $("#username").val();
    var password = $("#password").val();
    User.login(username, password);
}

function checkLogInState()
{
    if (User.getCurrent() != null && localStorage.getItem("rem") != null) {
        $.mobile.changePage("event-feed.html", { transition: "none" });
    }
    else if (localStorage.getItem("rem") == null) {
        User.logout();
    }
}


//inserts new user data into db if the form is valid
function handleSignupForm()
{
	if ($("#signup-form").valid()) 
		{
			var email = $("#signup-email").val();
			var password = $("#signup-password").val();
			var fName = $("#signupfname").val();
			var lName = $("#signuplname").val();
		    var username = $("#signupuname").val();    

			User.register(email, username, password, fName, lName);
		}
}

//callback function that adds course to database
function handleAddCourse(transaction, results) {
	var courseCode = $('#course-code').val();
	var courseSection = $('#course-section').val();
	var courseName = $('#course-name').val();
	var semester = $('input[name=semester]:checked').val();
	var year = $("#course-year").val();
	var teacherName = $("#teacher-name").val();
				  
	Course.insert(courseCode, courseSection, courseName, semester, year, teacherName, User.getCurrent().id, function(course) {
		//UserCourse.insert(User.getCurrent().id, results.insertId);
		$.mobile.changePage("courses.html");
	});
}

//inserts event into the database if form is valid
function handleCreateEvent()
{
	if ($("#create-event").valid()) 
	{
		var course = $("#eventcourse").val();
		var eventype = $("#eventtype").val();
		var name = $("#eventname").val();
		var duedate = $("#eventdue").val();
		var eventtime = $("#eventtime").val();
		var eventworth = $("#eventworth").val();
		var description = $("#eventdescription").val();

		Event.insert(course, eventype, name, duedate, eventtime, eventworth, description);
	}
}

//changes if the create course form is visible
function toggleCreateCourse() {
	if ($("#add-course-form").is(":hidden")) {
		$("#add-course-form").show();
		$("#toggle-create-course").removeClass("ui-icon-carat-r");
		$("#toggle-create-course").addClass("ui-icon-carat-d");
	} else {
		$("#add-course-form").hide();
		$("#toggle-create-course").removeClass("ui-icon-carat-d");
		$("#toggle-create-course").addClass("ui-icon-carat-r");
	}
}

//changes if time is visible or not on the create event page
function toggleTime()
{
    if ($("#eventtype").val() == "alw1BjIGi2")
	{
		$("#eventtimediv").addClass("hidden");
	}
	else
	{
		$("#eventtimediv").removeClass("hidden");
	}
}