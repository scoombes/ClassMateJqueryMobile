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

    $("#add-course-form").on("submit", function(event) {
        event.preventDefault();

        var courseCode = $(this).find('#course-code').val();
        var courseSection = $(this).find('#course-section').val();
        var courseName = $(this).find('#course-name').val();
        var semester = 1;
        var year = $(this).find("#course-year").val();
        var teacherName = $(this).find("#teacher-name").val();

        Course.insert(courseCode, courseSection, courseName, semester, year, teacherName);
    });

    $.mobile.defaultPageTransition = 'none';
});

function checkPage(activepage)
{
    switch(activepage)
    {
        case "login":
            alert("loginpage")
            loginValidations();
            checkRememberMe();
            break;
        case "register":
            registerValidations();
        default:
            break;
    }
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

$("#eventtype").on("change", function () {
    if ($("#eventtype").val() == 1) {
        $("#eventtimediv").hide();
    } else {
        $("#eventtimediv").show();
    }
});

$("#createevent").on("submit", function () {

});

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

function logOut() {
    localStorage.clear();
    $.mobile.changePage("login.html", {transition: "none"});
}

function toggleCreateCourse() {
    if ($("#add-course-form").is(":hidden")) {
        $("#add-course-form").show();
        $("#toggle-create-course").removeClass("ui-icon-carat-l");
        $("#toggle-create-course").addClass("ui-icon-carat-d");
    } else {
        $("#add-course-form").hide();
        $("#toggle-create-course").removeClass("ui-icon-carat-d");
        $("#toggle-create-course").addClass("ui-icon-carat-l");
    }
}