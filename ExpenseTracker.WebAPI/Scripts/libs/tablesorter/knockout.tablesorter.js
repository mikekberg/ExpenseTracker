ko.bindingHandlers.sortTable = {
    init: function (element, valueAccessor) {
        setTimeout(function () {
            $(element).addClass('tablesorter');
            /*
            $(element).tablesorter({
                widthFixed: true,
                widgets: ["zebra", "filter"],
                sortList: [[0,0], [1,0]],
                widgetOptions: {
                    // include child row content while filtering, if true
                    filter_childRows: true,
                    // class name applied to filter row and each input
                    filter_cssFilter: 'tablesorter-filter',
                    // search from beginning
                    filter_startsWith: false,
                    // Set this option to false to make the searches case sensitive 
                    filter_ignoreCase: true
                }
            });*/
        }, 0);
    }
};