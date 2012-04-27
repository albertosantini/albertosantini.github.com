/*jslint sloppy:true */
/*global YUI, alert */

YUI({
    filter: 'raw'
}).use("autocomplete", function (Y) {
    var acNode = Y.one('#ac-input');

    acNode.plug(Y.Plugin.AutoComplete, {
        activateFirstItem: true,
        maxResults: 10,
        minQueryLength: 5,
        resultListLocator: function (res) {
            var r;

            if (res.error) {
                return [];
            }

            r = res.query.results.json;

            if (r.status !== "OK") {
                return [];
            }

            r = r.results;

            if (r.length > 0) {
                return r;
            }

            return [r];
        },
        resultTextLocator: 'formatted_address',
        requestTemplate: function (query) {
            return encodeURI(query);
        },
        source: 'select * from json where ' +
            'url="http://maps.googleapis.com/maps/api/geocode/json?' +
            'sensor=false&' +
            'address={request}"',
        width: 'auto'
    });

    acNode.focus();

    acNode.ac.after('resultsChange', function () {
        var newWidth = this.get('boundingBox').get('offsetWidth');
        acNode.setStyle('width', Math.max(newWidth, 100));
    });

    acNode.ac.on('select', function (e) {
        alert(e.result.raw.formatted_address);
    });
});
