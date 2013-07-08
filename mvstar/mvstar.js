/*global jQuery */

(function ($) {
    "use strict";

    var todoMVCRepos = {
        "Agility.js": "https://api.github.com/repos/arturadib/agility",
        "AngularJS": "https://api.github.com/repos/angular/angular.js",
        "Backbone.js": "https://api.github.com/repos/jashkenas/backbone",
        "batman.js": "https://api.github.com/repos/batmanjs/batman",
        "Broke": "https://api.github.com/repos/brokenseal/broke-client",
        "CanJS": "https://api.github.com/repos/bitovi/canjs",
        "Chaplin": "https://api.github.com/repos/chaplinjs/chaplin",
        "cujo.js": "https://api.github.com/repos/cujojs/cujo",
        "dermis": "https://api.github.com/repos/wearefractal/dermis",
        "Dijon": "https://api.github.com/repos/creynders/dijon-framework",
        "Dojo": "https://api.github.com/repos/dojo/dojo",
        "Ember.js": "https://api.github.com/repos/emberjs/ember.js",
        "Epitome": "https://api.github.com/repos/epitome-mvc/Epitome",
        "Fidel": "https://api.github.com/repos/jgallen23/fidel",
        "Fun": "https://api.github.com/repos/marcuswestin/fun",
        "Funnyface.js": "https://api.github.com/repos/weepy/o_O",
        "JavaScriptMVC": "https://api.github.com/repos/bitovi/javascriptmvc",
        "jQuery": "https://api.github.com/repos/jquery/jquery",
        "Knockback.js": "https://api.github.com/repos/kmalakoff/knockback",
        "Knockout.js": "https://api.github.com/repos/knockout/knockout",
        "Maria": "https://api.github.com/repos/petermichaux/maria",
        "Marionette.js": "https://api.github.com/repos/marionettejs/" +
            "backbone.marionette",
        "Meteor": "https://api.github.com/repos/meteor/meteor",
        "Montage": "https://api.github.com/repos/montagejs/montage",
        "Olives": "https://api.github.com/repos/flams/olives",
        "Plastronjs": "https://api.github.com/repos/rhysbrettbowen/PlastronJS",
        "PureMVC": "https://api.github.com/repos/puremvc/" +
            "puremvc-js-multicore-framework",
        "rAppid.js": "https://api.github.com/repos/rappid/rAppid.js",
        "RequireJS": "https://api.github.com/repos/jrburke/requirejs",
        "Sammy.js": "https://api.github.com/repos/quirkey/sammy",
        "Serenade.js": "https://api.github.com/repos/elabs/serenade.js",
        "soma.js": "https://api.github.com/repos/somajs/somajs",
        "Spine": "https://api.github.com/repos/spine/spine",
        "Stapes.js": "https://api.github.com/repos/hay/stapes",
        "Thorax": "https://api.github.com/repos/walmartlabs/thorax",
        "TroopJS": "https://api.github.com/repos/troopjs/troopjs-core",
        "Yui": "https://api.github.com/repos/yui/yui3"
    },
    todoMVCNode = $("#TodoMVC"),
    todoMVCProjects = [];

    function projectRender(node, project) {
        var content = node.html(),
            projectLink = "<a href='" +
                project.link + "'>" +
                project.name + "</a>";

        content += "<dt>" + projectLink + "</dt>" +
            "<dd class='watchers'>" + project.watchers + "</dd>";

        node.html(content);
    }

    function getWatchers(node, repos, projects) {
        $.each(repos, function (projectName, repoUrl) {
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                cache: true,
                url: repoUrl,
                success: function (response) {
                    var project;

                    if (response.data.html_url) {
                        project = {
                            name: projectName,
                            link: response.data.html_url,
                            watchers: response.data.watchers
                        };
                    } else {
                        project = {
                            name: projectName,
                            link: "#",
                            watchers: response.data.message || response.message
                        };
                    }

                    projects.push(project);
                    projectRender(node, project);
                }
            });
        });
    }

    function projectNameComparator(p1, p2) {
        var a = p1.name.toLowerCase(),
            b = p2.name.toLowerCase();

        return a < b ? -1 : a > b ? 1 : 0;
    }

    function projectWatchersComparator(p1, p2) {
        var a = p1.watchers,
            b = p2.watchers;

        return a < b ? 1 : a > b ? -1 : 0;
    }

    function sortProjects(node, projects, sortFn) {
        var sortedProjects = projects.sort(sortFn);

        node.empty();
        $.each(sortedProjects, function (index, project) {
            projectRender(node, project);
        });
    }

    $("#sort-by-project-name").on("click", function () {
        sortProjects(todoMVCNode, todoMVCProjects, projectNameComparator);
    });

    $("#sort-by-watchers-count").on("click", function () {
        sortProjects(todoMVCNode, todoMVCProjects, projectWatchersComparator);
    });

    getWatchers(todoMVCNode, todoMVCRepos, todoMVCProjects);

}(jQuery));
