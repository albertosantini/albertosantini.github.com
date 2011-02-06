/*jslint browser: true */
/*globals YUI */


YUI().use('node', 'async-queue', 'yql', 'gallery-tagcloud', function (Y) {
    var yuiForumUrl = "http://yuilibrary.com/forum/",
        yuiRecentPostsUrl = "http://yuilibrary.com/forum/recent.php",
        goButton = Y.one("#go"),
        forumEdit = Y.one("#forum"),
        authors = [], tags = [];

    function init() {
        forumEdit.set('value', yuiRecentPostsUrl);
        goButton.set("disabled", false);
    }

    function getTopics(url, cbfunc) {
        var topics = [];

        Y.YQL('select * from html where url="' + url + '"', function (r) {
            var n, i, result = r.query.results;

            n = result.body.div.div.div[2].div[0].div.table[1].tr.length;
            for (i = 1; i < n; i += 1) { // first element is the header
                topics.push(result.body.div.div.div[2].div[0].div
                    .table[1].tr[i].td[0].p.a.href);
            }
            cbfunc(topics);
        });
    }

    function createClouds() {
        var text1 = Y.one("#text1"),
            text2 = Y.one("#text2"),
            authorsWithoutSpaces = [];

        text1.empty(true);
        text2.empty(true);

        Y.each(authors, function (author) {
            author = author.replace(/\W/g, '_');
            authorsWithoutSpaces.push(author);
        });
        text1.set('innerHTML', authorsWithoutSpaces);
        text1.tagCloud("#cloud1", {sort: false});
        text2.set('innerHTML', tags);
        text2.tagCloud("#cloud2", {sort: false});
    }

    function getPostInfo(url) {
        var q = this.pause();

        Y.YQL('select * from html where url="' + url + '"', function (r) {
            var n, i, m, j, result;

            if (r.query.count > 0) {
                result = r.query.results;
                n =  result.body.div.div.div[2].div[0].div.div[1].div[1].table.length;
                for (i = 0; i < n; i += 1) {
                    if (result.body.div.div.div[2].div[0].div.div[1].div[1].table[i].tr.td[0].div.length > 0) {
                        authors.push(result.body.div.div.div[2].div[0].div.div[1].div[1].table[i].tr.td[0].div[0].h3);
                        m = result.body.div.div.div[2].div[0].div.div[1].div[1].table[i].tr.td[0].div[1].ul.li.length;
                        for (j = 0; j < m; j += 1) {
                            tags.push(result.body.div.div.div[2].div[0].div.div[1].div[1].table[i].tr.td[0].div[1].ul.li[j].a.content);
                        }
                    } else {
                        authors.push(result.body.div.div.div[2].div[0].div.div[1].div[1].table[i].tr.td[0].div.h3);
                    }
                }
            }

            createClouds();

            q.run();
        });
    }

    function forumScraping(url) {
        getTopics(url, function (topics) {
            var i,
                n = topics.length,
                q = new Y.AsyncQueue();

            for (i = 0; i < n; i += 1) {
                q.add({
                    fn: getPostInfo,
                    args: [yuiForumUrl + topics[i]]
                });
            }

            q.add(function () {
                goButton.set("disabled", false);
            });

            q.run();
        });
    }

    goButton.on("click", function (e) {
        var forumUrl = forumEdit.get('value');

        this.set("disabled", true);
        try {
            forumScraping(forumUrl);
        } catch (ex) {
            init();
        }
    });

    init();
});


