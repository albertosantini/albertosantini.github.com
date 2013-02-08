/*jslint unparam:true */
/*global jQuery */

(function ($) {
    'use strict';

    var throneOfJS2012Repos = {
            'AngularJS': 'https://api.github.com/repos/angular/angular.js',
            'Backbone.js': 'https://api.github.com/repos/documentcloud/backbone',
            'batman.js': 'https://api.github.com/repos/Shopify/batman',
            'CanJS': 'https://api.github.com/repos/bitovi/canjs',
            'Ember.js': 'https://api.github.com/repos/emberjs/ember.js',
            'Knockout.js': 'https://api.github.com/repos/SteveSanderson/knockout',
            'Meteor': 'https://api.github.com/repos/meteor/meteor',
            'Spine': 'https://api.github.com/repos/spine/spine'
        },
        throneOfJS2012Node = $('#ThroneOfJS-2012'),
        throneOfJS2012Projects = [],
        todoMVCRepos = {
            'Agility.js': 'https://api.github.com/repos/arturadib/agility',
            'AngularJS': 'https://api.github.com/repos/angular/angular.js',
            'Backbone.js': 'https://api.github.com/repos/documentcloud/backbone',
            'batman.js': 'https://api.github.com/repos/Shopify/batman',
            'Broke': 'https://api.github.com/repos/brokenseal/broke-client',
            'CanJS': 'https://api.github.com/repos/bitovi/canjs',
            'cujo.js': 'https://api.github.com/repos/cujojs/cujo',
            'Dijon': 'https://api.github.com/repos/creynders/dijon-framework',
            'Dojo': 'https://api.github.com/repos/dojo/dojo',
            'Ember.js': 'https://api.github.com/repos/emberjs/ember.js',
            'Epitome': 'https://api.github.com/repos/DimitarChristoff/Epitome',
            'Fidel': 'https://api.github.com/repos/jgallen23/fidel',
            'Fun': 'https://api.github.com/repos/marcuswestin/fun',
            'Funnyface.js': 'https://api.github.com/repos/weepy/o_O',
            'JavaScriptMVC': 'https://api.github.com/repos/bitovi/javascriptmvc',
            'jQuery': 'https://api.github.com/repos/jquery/jquery',
            'Knockback.js': 'https://api.github.com/repos/kmalakoff/knockback',
            'Knockout.js': 'https://api.github.com/repos/SteveSanderson/knockout',
            'Maria': 'https://api.github.com/repos/petermichaux/maria',
            'Meteor': 'https://api.github.com/repos/meteor/meteor',
            'Montage': 'https://api.github.com/repos/Motorola-Mobility/montage',
            'Olives': 'https://api.github.com/repos/flams/olives',
            'Plastronjs': 'https://api.github.com/repos/rhysbrettbowen/PlastronJS',
            'rAppid.js': 'https://api.github.com/repos/it-ony/rAppid.js',
            'RequireJS': 'https://api.github.com/repos/jrburke/requirejs',
            'Sammy.js': 'https://api.github.com/repos/quirkey/sammy',
            'soma.js': 'https://api.github.com/repos/somajs/somajs',
            'Spine': 'https://api.github.com/repos/spine/spine',
            'Stapes.js': 'https://api.github.com/repos/hay/stapes',
            'TroopJS': 'https://api.github.com/repos/troopjs/troopjs-core',
            'Yui': 'https://api.github.com/repos/yui/yui3'
        },
        todoMVCNode = $('#TodoMVC'),
        todoMVCProjects = [],
        labsRepos = {
            'Thorax': 'https://api.github.com/repos/walmartlabs/thorax'
        },
        labsNode = $('#Labs'),
        labsProjects = [];

    function projectRender(node, project) {
        var content = node.html(),
            projectLink = '<a href="' +
                project.link + '">' +
                project.name + '</a>';

        content += '<dt>' + projectLink + '</dt>' +
            '<dd class="watchers">' + project.watchers + '</dd>';

        node.html(content);
    }

    function getWatchers(node, repos, projects) {
        $.each(repos, function (projectName, repoUrl) {
            jQuery.ajax({
                type: 'GET',
                dataType: 'jsonp',
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
                            link: '#',
                            watchers: response.data.message
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

    $('#sort-by-project-name').on('click', function () {
        sortProjects(throneOfJS2012Node,
            throneOfJS2012Projects, projectNameComparator);
        sortProjects(todoMVCNode,
            todoMVCProjects, projectNameComparator);
    });

    $('#sort-by-watchers-count').on('click', function () {
        sortProjects(throneOfJS2012Node,
            throneOfJS2012Projects, projectWatchersComparator);
        sortProjects(todoMVCNode,
            todoMVCProjects, projectWatchersComparator);
    });

    getWatchers(throneOfJS2012Node,
        throneOfJS2012Repos, throneOfJS2012Projects);
    getWatchers(todoMVCNode,
        todoMVCRepos, todoMVCProjects);
    getWatchers(labsNode,
        labsRepos, labsProjects);

}(jQuery));
