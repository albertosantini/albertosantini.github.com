/*global angular */

(function (angular) {
    "use strict";

    var app = angular.module("mvstar", [], function ($interpolateProvider) {
        $interpolateProvider.startSymbol("{[");
        $interpolateProvider.endSymbol("]}");
    });

    app.factory("mvstarRepos", function () {
        return [
            {repo: "arturadib/agility"},
            {repo: "angular/angular.js"},
            {repo: "jashkenas/backbone"},
            {repo: "batmanjs/batman"},
            {repo: "brokenseal/broke-client"},
            {repo: "bitovi/canjs"},
            {repo: "chaplinjs/chaplin"},
            {repo: "cujojs/cujo"},
            {repo: "wearefractal/dermis"},
            {repo: "creynders/dijon"},
            {repo: "dojo/dojo"},
            {repo: "emberjs/ember.js"},
            {repo: "epitome-mvc/Epitome"},
            {repo: "jgallen23/fidel"},
            {repo: "flightjs/flight"},
            {repo: "marcuswestin/fun"},
            {repo: "weepy/o_O"},
            {repo: "bitovi/javascriptmvc"},
            {repo: "jquery/jquery"},
            {repo: "kmalakoff/knockback"},
            {repo: "knockout/knockout"},
            {repo: "petermichaux/maria"},
            {repo: "marionettejs/backbone.marionette"},
            {repo: "meteor/meteor"},
            {repo: "montagejs/montage"},
            {repo: "flams/olives"},
            {repo: "polymer/polymer"},
            {repo: "rhysbrettbowen/PlastronJS"},
            {repo: "puremvc/puremvc-js-multicore-framework"},
            {repo: "facebook/react"},
            {repo: "Rich-Harris/Ractive"},
            {repo: "rappid/rAppid.js"},
            {repo: "jrburke/requirejs"},
            {repo: "moot/riotjs"},
            {repo: "quirkey/sammy"},
            {repo: "elabs/serenade.js"},
            {repo: "somajs/somajs"},
            {repo: "spine/spine"},
            {repo: "hay/stapes"},
            {repo: "walmartlabs/thorax"},
            {repo: "troopjs/troopjs-core"},
            {repo: "yui/yui3"}
        ];
    });

    app.factory("cssRepos", function () {
        return [
            {repo: "twbs/bootstrap"},
            {repo: "sourcebitsllc/chocolatechip-ui"},
            {repo: "zurb/foundation"},
            {repo: "yui/pure"},
            {repo: "jlukic/Semantic-UI"},
            {repo: "topcoat/topcoat"}
        ];
    });

    // AngularJS: Creating A Service With $http
    // http://www.benlesh.com/2013/02/angularjs-creating-service-with-http.html
    app.factory("ghService", function ($http, $q) {
        return {
            getRepoInfo: function (data) {
                var ghRepoUrl = "https://api.github.com/repos/",
                    url = ghRepoUrl + data.repo,
                    deferred = $q.defer();

                data.params = data.params || {};
                data.params.callback = "JSON_CALLBACK";

                $http.jsonp(url, data)
                    .success(function (response) {
                        deferred.resolve(response.data);
                    }).error(function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        };
    });

    app.controller("mvstarCtrl",
            ["$scope", "$q", "$filter", "ghService", "mvstarRepos", "cssRepos",
            function ($scope, $q, $filter, ghService, mvstarRepos, cssRepos) {
        var ghCalls = [];

        $scope.mvstarReposInfo = [];
        $scope.cssReposInfo = [];
        $scope.repoOrderBy = "name";

        mvstarRepos.forEach(function (repo) {
            var ghCall = ghService.getRepoInfo(repo);

            ghCall.then(function (repoInfo) {
                $scope.mvstarReposInfo.push(repoInfo);
            });

            ghCalls.push(ghCall);
        });
        cssRepos.forEach(function (repo) {
            var ghCall = ghService.getRepoInfo(repo);

            ghCall.then(function (repoInfo) {
                $scope.cssReposInfo.push(repoInfo);
            });

            ghCalls.push(ghCall);
        });

        // called when ghCalls are completed: maybe to save the standings
        $q.all(ghCalls).then(function () {
            // var repos;

            // repos = $filter("orderBy")($scope.mvstarReposInfo, "-watchers");
            // repos.forEach(function (repo, index) {
            //     console.log(index + 1, repo.name);
            // });
        });

    }]);

}(angular));
