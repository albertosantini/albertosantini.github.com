/*global jQuery, YAHOO:true */

var YAHOO = {};
YAHOO.Finance = {};
YAHOO.Finance.SymbolSuggest = {};

(function ($) {
    "use strict";

    // var assets = {};

    YAHOO.Finance.SymbolSuggest.ssCallback = function (data) {
        // var res;

        // res = $.map(data.ResultSet.Result, function (item) {
        //     var asset = {
        //             symbol: item.symbol,
        //             name: item.name,
        //             type: item.type,
        //             exchDisp: item.exchDisp
        //         },
        //         key = asset.symbol + " " + asset.name +
        //             " (" + asset.type + " - " + asset.exchDisp + ")";

        //     assets[key] = asset;

        //     return key;
        // });

        // process(res);

        console.log(data);
    };

    $("#ac-input").typeahead({
        name: "symbols",
        limit: 10,
        remote: {
            url: "http://autoc.finance.yahoo.com/autoc?query=%QUERY",
            replace: function (url) {
                console.log(url);

                return url +
                    "&callback=YAHOO.Finance.SymbolSuggest.ssCallback";
            },
            filter: function (response) {
                console.log(response);

                return response;
            }
        }
    });

}(jQuery));
