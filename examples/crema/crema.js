/*jslint browser: true */
/*globals YUI, jQuery */

YUI({
    filter: 'raw'
}).use('node', 'async-queue', 'yql', 'gallery-tagcloud',
    function (Y) {
    var yuiForumUrl = "http://yuilibrary.com/forum/",
        yuiRecentPostsUrl = "http://yuilibrary.com/forum/recent.php",
        goButton = Y.one("#go"),
        forumEdit = Y.one("#forum"),
        authors = [], tags = [], totalTopics = 0, counterTopics = 0;

    function getTopics(url, cbfunc) {
        var topics = [];

        Y.YQL('select * from html where url="' + url + '"', function (r) {
            jQuery(".tablebg tr td a[href*=viewtopic]", r.results[0])
                .each(function () {
                    topics.push(jQuery(this).attr("href"));
            });

            cbfunc(topics);
        }, {format: 'xml'});
    }

    function createClouds() {
        var text1 = Y.one("#text1"), text2 = Y.one("#text2");

        text1.empty(true);
        text2.empty(true);

        text1.set('innerHTML', authors);
        text1.tagCloud("#cloud1", {
            sort: false,
            fieldDelimeter: ',',
            fieldRegex: new RegExp(/[ ]+/g)
        });
        text2.set('innerHTML', tags);
        text2.tagCloud("#cloud2", {
            sort: false,
            fieldDelimeter: ',',
            fieldRegex: new RegExp(/[ ]+/g)
        });
    }

    function getPostInfo(url) {
        var q = this.pause();

        Y.YQL('select * from html where url="' + url + '"', function (r) {
            jQuery(".tablebg .mod h3", r.results[0])
                .each(function () {
                    authors.push(jQuery(this).text().replace(/[ ]+/g, '_'));
            });

            jQuery(".tablebg .tags ul li", r.results[0])
                .each(function () {
                    tags.push(jQuery(this).text()
                        .trim().replace(/[ ]+/g, '').replace(/\W/g, '_'));
            });

            counterTopics += 1;
            goButton.set('text', counterTopics + '/' + totalTopics + ' topics');

            createClouds();

            q.run();
        }, {format: 'xml'});
    }

    goButton.on("click", function (e) {
        goButton.set("disabled", true);
        goButton.set('text', 'Loading topics...');

        Y.one("#cloud1").empty();
        Y.one("#cloud2").empty();

        counterTopics = 0;

        getTopics(forumEdit.get('value'), function (topics) {
            var i, q = new Y.AsyncQueue();

            totalTopics = topics.length;
            goButton.set('text', '0/' + totalTopics + ' topics');

            for (i = 0; i < totalTopics; i += 1) {
                q.add({
                    fn: getPostInfo,
                    args: [yuiForumUrl + topics[i]]
                });
            }

            q.add(function () {
                goButton.set('text', 'Search');
                goButton.set("disabled", false);
            });

            q.run();
        });
    });

    forumEdit.set('value', yuiRecentPostsUrl);
    goButton.set("disabled", false);
});
