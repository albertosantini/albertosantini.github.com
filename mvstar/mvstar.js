/*global jQuery */

(function ($) {
    'use strict';

    var mvstarRepos = {
        'angular.js': 'https://api.github.com/repos/angular/angular.js',
        'backbone': 'https://api.github.com/repos/documentcloud/backbone',
        'batman': 'https://api.github.com/repos/Shopify/batman',
        'canjs': 'https://api.github.com/repos/jupiterjs/canjs',
        'ember.js': 'https://api.github.com/repos/emberjs/ember.js',
        'knockout': 'https://api.github.com/repos/SteveSanderson/knockout',
        'meteor': 'https://api.github.com/repos/meteor/meteor',
        'spine': 'https://api.github.com/repos/maccman/spine'
    };

    $.each(mvstarRepos, function (name, repoUrl) {
        jQuery.ajax({
            type: 'GET',
            dataType: 'jsonp',
            cache: true,
            url: repoUrl,
            success: function (response) {
                var results = $('#results'),
                    content = results.html();

                content += '<dt>' + name + '</dt>' +
                    '<dd>' + response.data.watchers + '</dd>';

                results.html(content);
            }
        });
    });

}(jQuery));

