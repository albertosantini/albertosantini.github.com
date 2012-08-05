/*global jQuery */

(function ($) {
    'use strict';

    var throneOfJS2012Repos = {
            'AngularJS': 'https://api.github.com/repos/angular/angular.js',
            'Backbone.js': 'https://api.github.com/repos/documentcloud/backbone',
            'batman.js': 'https://api.github.com/repos/Shopify/batman',
            'CanJS': 'https://api.github.com/repos/jupiterjs/canjs',
            'Ember.js': 'https://api.github.com/repos/emberjs/ember.js',
            'Knockout.js': 'https://api.github.com/repos/SteveSanderson/knockout',
            'Meteor': 'https://api.github.com/repos/meteor/meteor',
            'Spine': 'https://api.github.com/repos/maccman/spine'
        },
        todoMVCRepos = {
            'Agility.js': 'https://api.github.com/repos/arturadib/agility',
            'AngularJS': 'https://api.github.com/repos/angular/angular.js',
            'Backbone.js': 'https://api.github.com/repos/documentcloud/backbone',
            'batman.js': 'https://api.github.com/repos/Shopify/batman',
            'Broke': 'https://api.github.com/repos/brokenseal/broke-client',
            'CanJS': 'https://api.github.com/repos/jupiterjs/canjs',
            'cujo.js': 'https://api.github.com/repos/cujojs/cujo',
            'Dijon': 'https://api.github.com/repos/creynders/dijon-framework',
            'Dojo': 'https://api.github.com/repos/dojo/dojo',
            'Ember.js': 'https://api.github.com/repos/emberjs/ember.js',
            'Epitome': 'https://api.github.com/repos/DimitarChristoff/Epitome',
            'Fidel': 'https://api.github.com/repos/jgallen23/fidel',
            'Fun': 'https://api.github.com/repos/marcuswestin/fun',
            'Funnyface.js': 'https://api.github.com/repos/weepy/o_O',
            'JavaScriptMVC': 'https://api.github.com/repos/jupiterjs/javascriptmvc',
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
            'Spine': 'https://api.github.com/repos/maccman/spine',
            'Stapes.js': 'https://api.github.com/repos/hay/stapes',
            'TroopJS': 'https://api.github.com/repos/troopjs/troopjs-core',
            'Yui': 'https://api.github.com/repos/yui/yui3'
        };

    function getWatchers(node, repos) {
        $.each(repos, function (projectName, repoUrl) {
            jQuery.ajax({
                type: 'GET',
                dataType: 'jsonp',
                cache: true,
                url: repoUrl,
                success: function (response) {
                    var results = $(node),
                        content = results.html(),
                        projectLink = '<a href="' + repoUrl + '">' +
                            projectName + '</a>';

                    content += '<dt>' + projectLink + '</dt>' +
                        '<dd>' + response.data.watchers + '</dd>';

                    results.html(content);
                }
            });
        });
    }

    getWatchers('#ThroneOfJS-2012', throneOfJS2012Repos);
    getWatchers('#TodoMVC', todoMVCRepos);
}(jQuery));

