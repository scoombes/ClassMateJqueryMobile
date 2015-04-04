$(document).on("pagecontainerbeforeshow", function(event, ui) {
    //who put this here? - Sean
    //var activePage = $.mobile.pageContainer.pagecontainer("getActivePage").prop('id');


    var activepage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    checkPage(activepage);

    $("#signupbtn").on("click", function(event) {$.mobile.changePage("register.html", {transition: "none"}); event.preventDefault(); });
    $(".create-post-btn").on("click", function(){$(".create-post").toggle(".hidden")});
    $("#up-vote").on("click", setVote);
    $("#down-vote").on("click", setVote);
    $("#logout-button").on("click", logOut);
    $("#add-course-form").hide();
    $("#toggle-create-course").on("click", toggleCreateCourse);

    $.mobile.defaultPageTransition = 'none';
});

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
            Event.read(localStorage.getItem("row-id"));
            break;
        default:
            break;
    }
}

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

function addExistingCourse() {
    var id = $(this).attr('data-course-id');
    UserCourse.insert(User.getCurrent().id, id, function() {
        $.mobile.changePage('courses.html'); 
    }, function() {
        alert('You are already in that course');
    });
}


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
    display.attr("event_course_info", dbItem["course_code"] + "-" + dbItem["section"]);
    display.attr("event_course_id", dbItem["course_id"]);

    display.click(function()
    {
        $.mobile.changePage("event-details.html", { data: { "event_id": $(this).attr("event-id") }, reloadPage: true, changeHash: true });
    });

    display.append($("<h3>").addClass("course-name").text(event.courseCode));
    display.append($("<h2>").addClass("assignment-name").text(event.name));
    display.append($("<h3>").addClass("due-date").text(getDate(event.dueDate)));



    display.append($("<div>").addClass("vote-bar").append($("<div>").addClass("upvote-bar"))
                                                .append($("<div>").addClass("downvote-bar")));

    var upvotes = dbItem['upvotes'];
    var downvotes = dbItem['downvotes'] || 0;

    var upvotePercent = upvotes / (upvotes + downvotes) * 100;
    var downvotePercent = downvotes / (upvotes + downvotes) * 100;

    display.find('.upvote-bar').css('height', upvotePercent + '%');
    display.find('.downvote-bar').css('height', downvotePercent + '%');

    /*
    $('[data-row-id=' + event.id + '] .upvote-bar').css('height', upvotePercent + '%');
    $('[data-row-id=' + event.id + '] .downvote-bar').css('height', downvotePercent + '%');*/

    //Vote.readEventVotes(event.id, setEventVoteBar);

    display.click(function()
    {
        var id = eventElement.attr("data-row-id");
        localStorage.setItem("row-id", id);
    });

    display.appendTo(eventElement);

    return eventElement;
}

function handleEventFeed(transaction, results)
{
    var eventList = $("#event-feed-list");
    eventList.empty();

    for (var i = 0; i < results.rows.length; i++)
    {
        var eventElement = createEventElement(results.rows.item(i));
        eventElement.appendTo(eventList);
    }
    eventList.listview("refresh");
}

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

    //whole buncha logic to add vote to the sweet sweet database of ours
}

function handleLoginForm()
{
    if ($("#login-form").valid()) 
    {
        var email = $("#email").val();
        var password = $("#password").val();

        User.login(email, password);
    }
}

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

function logOut() {
    localStorage.clear();
    $.mobile.changePage("login.html", {transition: "none"});
}

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

function setEventVoteBar(transaction, results) {
    if (results.rows.length > 0) {
        var upvotePercent = 100 * results.rows.item(0).upvote / (results.rows.item(0).upvote + results.rows.item(0).downvote);
        var downvotePercent = 100 * results.rows.item(0).downvote / (results.rows.item(0).upvote + results.rows.item(0).downvote);
        alert(results.rows.item(0).eventId + ", " + upvotePercent + ", " + downvotePercent);
        $('[data-row-id=' + results.rows.item(0).eventId + '] .upvote-bar').css('height', upvotePercent + '%');
        $('[data-row-id=' + results.rows.item(0).eventId + '] .downvote-bar').css('height', downvotePercent + '%');
    }
}