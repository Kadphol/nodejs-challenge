$(function() {
    (function(name) {
        var container = $("#pagination-" + name);
        container.pagination({
            dataSource: function(done) {
                $.ajax({
                    type: "GET",
                    url: `/api/github/all`,
                    beforeSend: function() {
                        container.prev().html("Loading data from github ...");
                    },
                    success: function(response) {
                        done(response.items);
                    }
                });
            },
            locator: "items",
            pageSize: 10,
            pageRange: 10,
            pageNumber: 1,
            showPageNumbers: true,
            showPrevious: true,
            showNext: true,
            showNavigator: true,
            showFirstOnEllipsisShow: true,
            showLastOnEllipsisShow: true,
            callback: function(response, pagination) {
                var dataHtml = "<ul>";

                $.each(response, function (index, item) {
                    dataHtml += '<li><a href="' + item.html_url + '">' + item.full_name + '</a></li>';
                });

                dataHtml += "</ul>";

                container.prev().html(dataHtml);
            }
        });
    })("demo2");
})