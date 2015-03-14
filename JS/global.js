$(document).on("pagecontainershow", function(event, ui) {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage").prop('id');
    if (activePage != "eventfeed") {
        return;
    }

    Chart.defaults.global.showTooltips = false;

    $(".pie").each(function() {
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
    //$("#confirmsignup").on("click", function() {$.mobile.changePage("eventfeed.html", {transition: "none"})});

    $("#signupbtn").on("click", function() {$.mobile.changePage("register.html", {transition: "none"})});
    $("#loginbtn").on("click", function() {$.mobile.changePage("eventfeed.html", {transition: "none"})});

});