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
});

$(document).ready(function()
{
    $("#signupbtn").on("click", function(event) {$.mobile.changePage("register.html", {transition: "none"}); event.preventDefault(); });
    $("#loginbtn").on("click", function(event) {$.mobile.changePage("eventfeed.html", {transition: "none"}); event.preventDefault(); });
    $(".create-post-btn").on("click", showCreatePost);
    $("#up-vote").on("click", setVote);
    $("#down-vote").on("click", setVote)
});

function showCreatePost()
{
    $(".create-post").toggle(".hidden");
}

function setVote()
{
    //sadface
    var voteWorth;
    if ($(this).prop("id") == "up-vote")
    {
        $("#down-vote").removeClass("ui-btn-d");
        $("#up-vote").addClass("ui-btn-c");
    }
    else
    {
        $("#down-vote").addClass("ui-btn-d");
        $("#up-vote").removeClass("ui-btn-c");
    }

}