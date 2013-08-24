/*global YUI, alert */

YUI({
    filter: "raw"
}).use("autocomplete", function (Y) {
    "use strict";

    var acNode = Y.one("#ac-input");

    acNode.plug(Y.Plugin.AutoComplete, {
        maxResults: 10,
        resultTextLocator: "t",
        resultListLocator: "query.results.json.matches",
        resultFormatter: function (query, results) {
            return Y.Array.map(results, function (result) {
                var asset = result.raw;

                return asset.t + " - " + asset.n + " - " + asset.e;
            });
        },
        source: "select * from json " +
            "where url=\"http://www.google.com/finance/match?q={query}\""
    });

    acNode.ac.on("select", function (e) {
        alert(e.result.raw.n);
    });
});
