$(document).on("pagecontainerbeforeshow", function(event, ui) {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage").prop('id');

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
            addCourseValidations();
            break;
        case "courses":
            Course.readAll(handleCoursesLoad);
            break;
        case "createevent":
            createEventValidations();
            Course.populateList();
            $("#eventcourse").selectmenu("refresh");
            break;
        default:
            break;
    }
}

function handleCoursesLoad(transaction, results) {
    var courseList = $('.course-list');
    courseList.empty();
    
    for (var i = 0; i < results.rows.length; i++) {
        var course = {
            code: results.rows.item(i)['course_code'],
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
    alert(results.rows.length);
    for (var i=0; i < results.rows.length; i++)
    {
            
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