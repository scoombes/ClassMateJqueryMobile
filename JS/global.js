$(document).on("pagecontainerbeforeshow", function(event, ui) {
    //who put this here? - Sean
    //var activePage = $.mobile.pageContainer.pagecontainer("getActivePage").prop('id');

    $(ui.toPage).find('.vote-bar').each(function() {
        var upvoteCount = Math.floor((Math.random() * 20) + 1);
        var downvoteCount = Math.floor((Math.random() * 20) + 1);
        var totalVotes = upvoteCount + downvoteCount;

        var upvotePercent = (upvoteCount / totalVotes) * 100;
        var downvotePercent = (downvoteCount / totalVotes) * 100;

        $(this).find('.upvote-bar').css('height', upvotePercent + '%');
        $(this).find('.downvote-bar').css('height', downvotePercent + '%');
    });

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
        case "createevent":
            createEventValidations();
            Course.populateList();
            break;
        case "eventfeed":
            Event.readAll(handleEventFeed);
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
            semester: results.rows.item(i)['semester'],
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
    UserCourse.insert(User.getCurrent().id, id);
    $.mobile.changePage('courses.html');
}


function handleCoursesLoad(transaction, results) {
    var courseList = $('.course-list');
    courseList.empty();
    
    for (var i = 0; i < results.rows.length; i++) {
        var course = {
            id: results.rows.item(i)['id'],
            code: results.rows.item(i)['course_code'],
            section: results.rows.item(i)['section'],
            name: results.rows.item(i)['name'],
            teacherName: results.rows.item(i)['teacher_name'],
            semester: results.rows.item(i)['semester'],
            year: results.rows.item(i)['year']
        };

        var courseElement = $('<li>').addClass('eventfeed-item');
        
        var link = $('<a>').prop('href', 'course-details.html');
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

function handleEventFeed(transaction, results)
{
    var eventList = $("#event-feed-list");
    eventList.empty();

    for (var i = 0; i < results.rows.length; i++)
    {
        var courseID = results.rows.item(i)["course_id"];

        Course.getCourse(courseID);

        var event =
        {
            courseCode: localStorage.getItem("cc") + "-" + localStorage.getItem("sec"),
            name: results.rows.item(i)["name"],
            dueDate: results.rows.item(i)["due_date"],
            id: results.rows.item(i)["id"]
        };

        var eventElement = $("<li>").addClass("eventfeed-item");
        eventElement.attr("data-row-id", event.id);

        var display = $("<a>").prop("href", "event-details.html");
        display.append($("<h3>").addClass("course-name").text(event.courseCode));
        display.append($("<h2>").addClass("assignment-name").text(event.name));
        display.append($("<h3>").addClass("due-date").text(getDate(event.dueDate)));

        display.appendTo(eventElement);
        eventElement.appendTo(eventList);
    }
    eventList.listview("refresh");

    $(".eventfeed-item").click(function()
    {
        var id = this.getAttribute("data-row-id");

        localStorage.setItem("row-id", id);
    });
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
    var semester = 1;
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

function displayEvents(transaction, results) {
    for (var i=0; i < results.rows.length; i++)
    {
        var courseName;
        db.transaction(function (transaction) {
            transaction.executeSql("SELECT * FROM course WHERE id=?",[id],
                function (transaction, results) {
                    courseName = results.rows.item(0).name;
                }, errorHandler);
        });
        var eventListHtml = '<li id="' + results.rows.item(i).id + '" class="eventfeed-item">'
            + '<a href="event-details.html">'
            + '<div class="vote-bar">'
            + '<div class="upvote-bar"></div>'
            + '<div class="downvote-bar"></div>'
            + '</div>'
            + '<h3 class="course-name">' + courseName + '</h3>'
            + '<h2 class="assignment-name">' + results.rows.item(i).name + '</h2>'
            + '<h3 class="due-date">' + results.rows.item(i).due_date + '</h3></a></li>';
        $("#event-feed-list").append(eventListHtml);
        Vote.readAll(results.rows.item(i).id);
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

function setEventVoteValues(eventId, upvotes, downvotes) {
    var upvotePercent = upvotes / (upvotes + downvotes);
    var downvotePercent = downvotes / (upvotes + downvotes);

    $("#event-id-" + eventId + " .upvote-bar").css('height', upvotePercent + '%');
    $("#event-id-" + eventId + " .downvote-bar-bar").css('height', upvotePercent + '%');
}