var month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]
var tableColumn = [
    {
        "data": "name",
        "title": "Repository name",
    },
    {
        "data": "url",
        "title": "Repository Url",
        render: function(data) {
            return '<a href="'+ data +'">' + data + '</a>';
        }
    },
    {
        "data": "count",
        "title": "Star Count"
    },
    {
        "data": "date",
        "title": "Last Updated",
        render: function(data) {
            let date = new Date(data);
            return `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        }
    }
];
$(document).ready(

    function () {
        $("#repo-table").DataTable({
                "processing": true,
                "serverSide": true,
                "searching": false,
                "paging": true,
                "ajax": "/api/github/table",
                "columns": tableColumn,
                "pageLength": 10,
                "lengthChange": false
        });
    }
);