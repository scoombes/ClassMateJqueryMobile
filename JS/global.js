/* global.js
 *	    File contains most functions needed for project to run
 *
 * 		Sean Coombes, Kyle Zimmerman, Justin Coschi  - 3/20/15 js file created
 */

//runs before each pages loads and sets up click events 
$(document).on("pagecontainerbeforeshow", function (event, ui) {
	var activepage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	checkPage(activepage);

	$("#signupbtn").on("click", function(event) {$.mobile.changePage("register.html", {transition: "none"}); event.preventDefault(); });
	$("#up-vote").on("click", setVote);
	$("#down-vote").on("click", setVote);
	$("#logout-button").on("click", logOut);
	$("#add-course-form").hide();
	$("#toggle-create-course").on("click", toggleCreateCourse);

	$.mobile.defaultPageTransition = 'none';
});

//called every page load and executes case depending on page loaded
function checkPage(activepage)
{
	switch(activepage)
	{
		case "login":
			loginValidations();
			checkRememberMe();
			break;
		case "register":
			registerValidations();
			break;
		case "add-course":
			Course.readAll(handleAddCoursesLoadExisting);
			addCourseValidations();
			break;
		case "courses":
			Course.readJoined(User.getCurrent().id, handleCoursesLoad);
			break;
		case "course-detail":
			var parameters = document.URL.split("?")[1];
			course_id = parameters.replace("course_id=","");
			Course.getCourse(course_id, handleCourseDetail);
			break;
		case "createevent":
			createEventValidations();
			Course.populateList();
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
		$("#details-name").text(result.event.get("name") + " Details");
		$("#details-due").text(result.event.get("dueDate"));
		$("#up-vote").text(result.upvotes);
		$("#up-vote").text(result.downvotes);

		if (result.event.get("finalGradeWeight") != "") {
			$("#details-grade-parent").removeClass("hidden");
			$("#details-grade").text(result.event.get("finalGradeWeight"));
		}
		else {
			$("#details-grade-parent").addClass("hidden");
			$("#details-grade").text("");
		}

		if (result.rows.item(0)["time"] != ""){
			$("#details-time-parent").removeClass("hidden");

			$("#details-time").text(formatTime(result.event.get("dueDate")));
			$("#details-time").text(formatTime(result.rows.item(0)["time"]));
		}
		else{
			$("#details-time-parent").addClass("hidden");
			$("#details-time").text("");
		}

		if (result.rows.item(0)["description"] != "") {
			$("#details-description-parent").removeClass("hidden");
			$("#details-description").text(result.rows.item(0)["description"]);
		}
		else {
			$("#details-description-parent").addClass("hidden");
			$("#details-description").text("");
		}
	});

	Vote.read(event_id, User.getCurrent().id, userEventVote);
}

//formats time to 12hr time from 24hr
function formatTime(eventTime)
{
    var hours = parseInt(eventTime.substr(0, 2));
	var mins = eventTime.substr(3, 4);
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
function handleAddCoursesLoadExisting(transaction, results) {
	var courseList = $('#add-existing-course');
	courseList.empty();
	
	for (var i = 0; i < results.rows.length; i++) {
		var course = {
			id: results.rows.item(i)['id'],
			code: results.rows.item(i)['course_code'],
			section: results.rows.item(i)['section'],
			name: results.rows.item(i)['name'],
			teacherName: results.rows.item(i)['teacher_name'],
			semester: results.rows.item(i)['semester.semester_name'],
			year: results.rows.item(i)['year']
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
	UserCourse.insert(User.getCurrent().id, id, function() {
		$.mobile.changePage('courses.html'); 
	}, function() {
		alert('You are already in that course');
	});
}

//prepares courses that user is in into a course list
function handleCoursesLoad(transaction, results) {
	var courseList = $('.course-list');
	courseList.empty();
	
	for (var i = 0; i < results.rows.length; i++) {

		var row = results.rows.item(i);
		var course = {
			id: results.rows.item(i)['id'],
			code: results.rows.item(i)['course_code'],
			section: results.rows.item(i)['section'],
			name: results.rows.item(i)['name'],
			teacherName: results.rows.item(i)['teacher_name'],
			semester: results.rows.item(i)['semester_name'],
			year: results.rows.item(i)['year']
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
function handleCourseDetail(transaction, results) {

	$('#course-event-list').empty();
	$('#course-event-list').listview('refresh');

	var result = results.rows.item(0);

	$('.course-info .course-code').text(result['course_code']);
	$('.course-info .section').text(result['section']);
	$('.course-info .course-name').text(result['name']);
	$('.course-info .teacher-name').text(result['teacher_name']);
	$('.course-info .semester').text(result['semester_name']);
	$('.course-info .year').text(result['year']);

	Event.getEventsForCourse(result['id'], function(transaction, results) {
		for (var i = 0; i < results.rows.length; i++) {
			var dbItem = results.rows.item(i);
			createEventElement(dbItem).appendTo($('#course-event-list'));
		}

		$('#course-event-list').listview('refresh');
	});
}

//prepares data of events to be used in a list
function handleEventFeed(transaction, results) {
    var eventList = $("#event-feed-list");
    eventList.empty();

    for (var i = 0; i < results.rows.length; i++) {
        var eventElement = createEventElement(results.rows.item(i));
        eventElement.appendTo(eventList);
    }
    eventList.listview("refresh");
}

//displays all events user has for subscribed courses in a list
function createEventElement(dbItem) {
	var event =
	{
		courseCode: dbItem["course_code"] + "-" + dbItem["section"],
		name: dbItem["name"],
		dueDate: dbItem["due_date"],
		id: dbItem["event_id"]
	};

	var eventElement = $("<li>").addClass("eventfeed-item");
	
	var display = $("<a>");
	display.attr("event-id", event.id);
	display.attr("event-course-info", dbItem["course_code"] + "-" + dbItem["section"]);
	display.attr("event-course-id", dbItem["course_id"]);

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

	var upvotes = dbItem['upvotes'] || 0;
	var downvotes = dbItem['downvotes'] || 0;

	var upvotePercent = upvotes / (upvotes + downvotes) * 100;
	var downvotePercent = downvotes / (upvotes + downvotes) * 100;

	display.find('.upvote-bar').css('height', upvotePercent + '%');
	if (upvotes > 0) {
		display.find('.upvote-bar').html(upvotes);
	}
	display.find('.downvote-bar').css('height', downvotePercent + '%');
	if (downvotes > 0) {
		display.find('.downvote-bar').html(downvotes);
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

	var month = monthNames[somedate.getMonth()];
	var weekday = daysOfWeek[somedate.getDay()+1];

	var day = date.substr(8, 2);

	return weekday + ", " + month + " " + day;
}

//checks if remember me has been selected
function checkRememberMe()
{
	if (localStorage.getItem("rem") != null && localStorage.getItem("rem") === "true")
	{
		$.mobile.changePage("event-feed.html", {transition: "none"});
	}
	else
	{
		localStorage.clear();
	}

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

	Vote.insert(currentEventId, currentUserId, voteWorth);
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
function handleLoginForm()
{
	if ($("#login-form").valid()) 
	{
		var email = $("#email").val();
		var password = $("#password").val();

		User.login(email, password);
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

			User.register(email, password, fName, lName);
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
				  
	Course.insert(courseCode, courseSection, courseName, semester, year, teacherName, User.getCurrent().id, function(transaction, results) {
		UserCourse.insert(User.getCurrent().id, results.insertId);
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

		Event.insert(course, eventype, name, duedate, eventtime, eventworth, description, User.getCurrent().id);
	}
}

//logs current user out
function logOut() {
	localStorage.clear();
	$.mobile.changePage("login.html", {transition: "none"});
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
	if ($("#eventtype").val() == "1") 
	{
		$("#eventtimediv").addClass("hidden");
	}
	else
	{
		$("#eventtimediv").removeClass("hidden");
	}
}