/*global jQuery, YAHOO:true */

var YAHOO = {};
YAHOO.Finance = {};
YAHOO.Finance.SymbolSuggest = {};

(function ($) {
    "use strict";



    $("#ac-input").typeahead({
        name: "symbols",
        limit: 10,
        remote: {
            url: "http://autoc.finance.yahoo.com/autoc?",
            dataType: "jsonp",
            cache: true,
            replace: function (url, uriEncodedQuery) {
                var that = this;

                YAHOO.Finance.SymbolSuggest.ssCallback = function (data) {
                    var res;

                    res = $.map(data.ResultSet.Result, function (item) {
                        var asset = {
                                symbol: item.symbol,
                                name: item.name,
                                type: item.type,
                                exchDisp: item.exchDisp
                            },
                            key = asset.symbol + " " + asset.name +
                                " (" + asset.type + " - " + asset.exchDisp + ")";

                        return key;
                    });

                    console.log("callback:", res);

                    that.filter(res);
                };

                return url +
                    "query=" + uriEncodedQuery +
                    "&callback=YAHOO.Finance.SymbolSuggest.ssCallback";
            },
            filter: function (response) {
                console.log("response:", response);

                return response;
            }
        }
    });

    $("#ac-input").on("typeahead:autocompleted", function (e) {
        console.log("completed:", e);
    });

}(jQuery));
