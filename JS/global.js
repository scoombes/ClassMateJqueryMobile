$(document).on("pagecontainershow", function(event, ui) {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage").prop('id');

    Chart.defaults.global.showTooltips = false;

    $(ui.toPage).find(".pie").each(function() {
        var context = $(this)[0].getContext('2d');

        var pieData = [
            {
                value: Math.floor((Math.random() * 20) + 1),
                color: "#46E62D",
            },
            {
                value: Math.floor((Math.random() * 20) + 1),
                color: "#FB3140",
            }
        ];

        new Chart(context).Pie(pieData, { animation: false, segmentStrokeColor: "#303030", segmentStrokeWidth: 2 });
    });

    $("#signupbtn").on("click", function(event) {$.mobile.changePage("register.html", {transition: "none"}); event.preventDefault(); });
    $("#loginbtn").on("click", function(event) {$.mobile.changePage("event-feed.html", {transition: "none"}); event.preventDefault(); });
    $(".create-post-btn").on("click", function(){$(".create-post").toggle(".hidden")});
    $("#up-vote").on("click", setVote);
    $("#down-vote").on("click", setVote)
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