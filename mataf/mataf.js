/*global jQuery, document */

jQuery(document).ready(function () {
    'use strict';

    var container = "", i, paths = [
        "http://www.mataf.net/en/forex/eurusd",
        "http://www.mataf.net/en/forex/usdchf",
        "http://www.mataf.net/en/forex/usdjpy",
        "http://www.mataf.net/en/forex/gbpusd",
        "http://www.mataf.net/en/forex/usdcad",
        "http://www.mataf.net/en/forex/gbpjpy",
        "http://www.mataf.net/en/forex/eurgbp",
        "http://www.mataf.net/en/forex/eurcad",
        "http://www.mataf.net/en/forex/eurjpy",
        "http://www.mataf.net/en/forex/audusd",
        "http://www.mataf.net/en/forex/euraud",
        "http://www.mataf.net/en/forex/eurchf"
    ];

    function requestCrossDomain(site, callback) {
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' +
            encodeURIComponent('select * from html where url="' + site + '"') +
            '&format=xml&callback=?';

        site = site || "http://www.google.com";

        function cbFunc(data) {
            if (data.results[0]) {
                data = data.results[0];

                if (typeof callback === 'function') {
                    callback(data);
                }
            } else {
                throw new Error('Nothing returned from getJSON.');
            }
        }

        jQuery.getJSON(yql, cbFunc);
    }

    function roundNumber(num, dec) {
        return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    }

    function myContainer(results) {
        var currency, entry, clock, stoploss, target1, riskreward1,
            sell = '<img height=12 width=12 ' +
            'src="http://www.mataf.net/images/_V3img/fleches/down.png">' +
            '<\/img>',
            buy = '<img height=12 width=12 ' +
            'src="http://www.mataf.net/images/_V3img/fleches/up.png">' +
            '<\/img>',
            flat = '<img height=12 width=12 ' +
            'src="http://www.mataf.net/images/_V3img/fleches/flat.png">' +
            '<\/img>';

        //~ jQuery('#container').html(results);

        currency = jQuery("h1.top1", results).text();
        entry = jQuery("#entry", results).attr("value");
        clock = jQuery("table.AT_analyse > tbody > tr > td:first", results)
            .text().split(" GMT")[0];
        if (entry !== undefined) {
            stoploss = jQuery("#stoploss", results).attr("value");
            target1 = jQuery("#t1", results).attr("value");
            riskreward1 = Math.abs(roundNumber((target1 - entry) /
                    (stoploss - entry), 1));

            container += "<b>";
            if (stoploss > entry) {
                container += sell;
            } else {
                container += buy;
            }
            container += currency + " (" + clock + ") - ";
            container += " entry: " + entry;
            container += " stoploss: " + stoploss;
            container += " target1: " + target1;
            container += " rw: " + riskreward1;
            container += " size: " + Math.round(100 / riskreward1);
            container += "<\/b>";
        } else {
            container += flat;
            container += currency + " (" + clock + ") - ";
            container += " no strategy";
        }
        container += "<br /><br />";
        jQuery('#results').html(container);
    }

    for (i = 0; i < paths.length; i = i + 1) {
        requestCrossDomain(paths[i], myContainer);
    }
});
