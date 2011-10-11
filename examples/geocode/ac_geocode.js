/*jslint sloppy:true, nomen:true */
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
            } else {
                return [r];
            }
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

    // http://yuilibrary.com/projects/yui3/ticket/2531285
    acNode.ac._createYQLSource = function (source) {
        var Lang   = Y.Lang,
            _SOURCE_SUCCESS = '_sourceSuccess',
            MAX_RESULTS = 'maxResults',
            RESULT_LIST_LOCATOR = 'resultListLocator',

            cache = {},
            yqlSource = {type: 'yql'},
            that = this,
            lastRequest,
            loading,
            yqlRequest;

        if (!this.get(RESULT_LIST_LOCATOR)) {
            this.set(RESULT_LIST_LOCATOR, this._defaultYQLLocator);
        }

        function _sendRequest(request) {
            var query = request.query,
                env = that.get('yqlEnv'),
                maxResults = that.get(MAX_RESULTS),
                callback,
                opts,
                yqlQuery;

            yqlQuery = Lang.sub(source, {
                maxResults: maxResults > 0 ? maxResults : 1000,
                request : request.request,
                query : query
            });

            if (cache[yqlQuery]) {
                that[_SOURCE_SUCCESS](cache[yqlQuery], request);
                return;
            }

            callback = function (data) {
                cache[yqlQuery] = data;
                that[_SOURCE_SUCCESS](data, request);
            };

            opts = {proto: that.get('yqlProtocol')};

            if (yqlRequest) {
                yqlRequest._callback = callback;
                yqlRequest._opts = opts;
                yqlRequest._params.q = yqlQuery;

                if (env) {
                    yqlRequest._params.env = env;
                }
            } else {
                yqlRequest = new Y.YQLRequest(yqlQuery, {
                    on: {success: callback},
                    allowCache: false
                }, env ? {env: env} : null, opts);
            }

            yqlRequest.send();
        }

        yqlSource.sendRequest = function (request) {
            lastRequest = request;

            if (!loading) {
                loading = true;

                Y.use('yql', function () {
                    yqlSource.sendRequest = _sendRequest;
                    _sendRequest(lastRequest);
                });
            }
        };

        return yqlSource;
    };

    acNode.focus();

    acNode.ac.after('resultsChange', function () {
        var newWidth = this.get('boundingBox').get('offsetWidth');
        acNode.setStyle('width', Math.max(newWidth, 100));
    });

    acNode.ac.on('select', function (e) {
        alert(e.result.raw.formatted_address);
    });
});
