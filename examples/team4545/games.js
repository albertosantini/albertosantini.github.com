/*jslint type:true */
/*global YUI */

YUI({
    modules: {
        'node': {
            requires: [
                'yql',
                'datatype-date',
                'datatable-base',
                'autocomplete',
                'autocomplete-filters',
                'cookie'
            ]
        }
    }
}).use('node', function (Y) {
    var baseUrl = "http://www.team4545league.org/",
        gamesUrl = baseUrl + "tournament/games.html",
        playerUrl = baseUrl + "players/displayhist.php?player=",
        teamName,
        teamNode = Y.one("#team"),
        gamesNode = Y.one("#games"),
        standingsNode = Y.one("#standings");

    teamName = Y.Cookie.get("teamName");
    if (teamName === null) {
        teamName = 'RedDeMate';
    }

    teamNode.set('value', teamName);

    function formatDate(date) {
        var edtNY = { // EDT periods for NY, otherwise EST, (Mar - Nov)
                2011: { "start": "031302:00", "end": "110602:00"},
                2012: { "start": "031102:00", "end": "110402:00"},
                2013: { "start": "031002:00", "end": "110302:00"},
                2014: { "start": "030902:00", "end": "110202:00"},
                2015: { "start": "030802:00", "end": "110102:00"},
                2016: { "start": "031302:00", "end": "110602:00"},
                2017: { "start": "031202:00", "end": "110502:00"},
                2018: { "start": "031102:00", "end": "110402:00"},
                2019: { "start": "031002:00", "end": "110302:00"}
            },
            win = Y.config.win,
            lang = win.navigator.userLanguage || win.navigator.language,
            intl = Y.DataType.Date.Locale.hasOwnProperty(lang) ? lang : "en-US",
            now = new Date(),
            yyyy = now.getFullYear(),
            sp = date.split(", "),
            www = sp[0],
            mmmddd = sp[1].split(" "),
            mmm = mmmddd[0],
            ddd = mmmddd[1],
            hhh = sp[2],
            mm = Y.Array.indexOf(Y.DataType.Date.Locale[intl].b, mmm) + 1,
            mdh = (mm < 10 ? "0" + mm : mm) + ddd + hhh,
            tz,
            ld;

        if (edtNY.hasOwnProperty(yyyy)) {
            if (mdh >= edtNY[yyyy].start && mdh < edtNY[yyyy].end) {
                tz = "EDT";
            } else {
                tz = "EST";
            }
        } else {
            if (mm >= 3 && mm < 11) {
                tz = "EDT";
            } else {
                tz = "EST";
            }
        }

        ld = new Date(www + ", " + ddd + " " + mmm + " " + yyyy +
            " " + hhh + ":00 " + tz);

        return Y.DataType.Date.format(ld, {format: "%a, %b %d, %H:%M"});
    }

    Y.DataTable.Base.prototype._createTbodyTdNode = function (o) {
        var column, td, temp, value, div;

        column = o.column;
        o.headers = column.headers;
        o.classnames = column.get("classnames");
        td = Y.Node.create(Y.Lang.substitute(this.tdTemplate, o));

        temp = {};
        temp.column = o.column;
        temp.headers = o.headers;
        temp.classnames = o.classnames;
        temp.record = o.record;
        temp.rowindex = o.rowindex;
        temp.tbody = o.tbody;
        temp.tr = o.tr;
        temp.td = td;

        value = this.formatDataCell(temp);

        div = td.one('div');
        div.set('innerHTML', value);

        return td;
    };

    function settingStyles(o) {
        var column, whiteTeam, blackTeam, result;

        column = o.column.get('key');

        if (column === "when") {
            o.td.setStyle('fontWeight', 'bold');
        }
        if (column === "whenLocal") {
            o.td.setStyle('color', 'blue');
        }
        if (column === "whitePlayer") {
            whiteTeam = o.record.getValue('whiteTeam');
            if (whiteTeam.search(teamName) >= 0) {
                o.td.setStyle('fontWeight', 'bold');
            }
        }
        if (column === "blackPlayer") {
            blackTeam = o.record.getValue('blackTeam');
            if (blackTeam.search(teamName) >= 0) {
                o.td.setStyle('fontWeight', 'bold');
            }
        }

        if (column === 'place' || column === 'team') {
            o.td.setStyle('fontWeight', 'bold');
        }
        if (column === 'forf') {
            if (o.value > 0) {
                o.td.setStyle('color', 'red');
            }
        }
        if (column.search('r') === 0) {
            result = o.value.split(" - ");

            if (result[0] > result[1]) {
                o.td.setStyle('color', 'green');
            } else if (result[0] < result[1]) {
                o.td.setStyle('color', 'red');
            } else if (result[0] === "0.0" && result[1] === "0.0") {
                o.value = "";
            }
        }

        return o.value;
    }

    function myStandings(results) {
        var node, standings = [], standingsDT;

        if (results.results.length === 0) {
            standingsNode.setContent("Problems to retrieve team4545 info.");
            return;
        }

        node = Y.Node.create(results.results[0]);

        node.all("table.stand tr").each(function (el) {
            var trim = Y.Lang.trim, cols = el.all("td"), st = {};

            if (cols.size() < 6) {
                return;
            }

            st.place = trim(cols.item(0) && cols.item(0).get('text')) || "";
            st.team = (cols.item(1) && cols.item(1).get('text')
                .replace(/\n\s{2,}/g, ' ')) || "";
            st.mp = trim(cols.item(2) && cols.item(2).get('text')) || "";
            st.gp = trim((cols.item(3) && cols.item(3).get('text')) || "");
            st.forf = trim(cols.item(4) && cols.item(4).get('text')) || "";
            st.r1 = trim(cols.item(5) && cols.item(5).get('text')) || "";
            st.r2 = trim(cols.item(6) && cols.item(6).get('text')) || "";
            st.r3 = trim(cols.item(7) && cols.item(7).get('text')) || "";
            st.r4 = trim(cols.item(8) && cols.item(8).get('text')) || "";
            st.r5 = trim(cols.item(9) && cols.item(9).get('text')) || "";
            st.r6 = trim(cols.item(10) && cols.item(10).get('text')) || "";

            standings.push(st);
        });

        function standingsTeamFilter(team) {
            var newStandings = [], isOurTeam, i;

            for (i = 0; i < standings.length; i += 1) {
                isOurTeam = standings[i].team.search(team) !== -1;
                if (isOurTeam) {
                    newStandings.push(standings[i]);
                }
            }
            standingsDT.set('recordset', newStandings);
        }

        standingsDT = new Y.DataTable.Base({
            columnset: [
                { key: "place", label: "Place",
                    formatter: settingStyles},
                { key: "team", label: "Team",
                    formatter: settingStyles},
                { key: "mp", label: "MP"},
                { key: "gp", label: "GP"},
                { key: "forf", label: "F",
                    formatter: settingStyles},
                { key: "r1", label: "R1 P1",
                    formatter: settingStyles},
                { key: "r2", label: "R2 P2",
                    formatter: settingStyles},
                { key: "r3", label: "R3 P3",
                    formatter: settingStyles},
                { key: "r4", label: "R4 P4",
                    formatter: settingStyles},
                { key: "r5", label: "R5",
                    formatter: settingStyles},
                { key: "r6", label: "R6",
                    formatter: settingStyles}
            ],
            recordset: []
        });

        standingsTeamFilter(teamName);

        Y.on("teamNameChange", function (team) {
            standingsTeamFilter(team);
        });

        if (standings.length) {
            standingsDT.render("#standings");
        } else {
            standingsNode.setContent("There are not standings yet.");
        }
    }

    function myGames(results) {
        var node, tourney, standingsUrl, games = [], teams = [], gamesDT;

        if (results.results.length === 0) {
            gamesNode.setContent("Problems to retrieve team4545 info.");
            return;
        }

        node = Y.Node.create(results.results[0]);

        tourney = node.all("h3").get("text")[0].split("- ")[1].split(" ")[0]
            .toLowerCase();
        standingsUrl = baseUrl + "tournament/" + tourney +
            "/" + tourney + "standing.html";

        Y.YQL('select * from html where url="' + standingsUrl + '"',
            myStandings, { format: 'xml' });

        node.all("tr").each(function (el) {
            var cols = el.all("td p"), game = {};

            if (cols.size() === 0) {
                return;
            }

            game.division = cols.item(0).get('text').replace(/\s{2,}/g, ' ');
            game.divisionLink = baseUrl +
                Y.Node.create(cols.item(0).getContent())
                .one("a").getAttribute("href");
            game.division = '<a href="' + game.divisionLink + '">' +
                game.division + '</a>';
            game.round = cols.item(1).getContent();
            game.when = cols.item(2).getContent();
            game.whenLocal = formatDate(game.when);
            game.whiteTeam = cols.item(3).getContent();
            game.whitePlayer = '<a href="' + playerUrl +
                cols.item(4).getContent() + '">' +
                cols.item(4).getContent() + '</a>';
            if (cols.size() === 9) {
                game.blackPlayer = '<a href="' + playerUrl +
                    cols.item(6).getContent() + '">' +
                    cols.item(6).getContent() + '</a>';
                game.blackTeam = cols.item(7).getContent();
                game.board = cols.item(8).getContent();
            } else {
                game.blackPlayer = '<a href="' + playerUrl +
                    cols.item(5).getContent() + '">' +
                    cols.item(5).getContent() + '</a>';
                game.blackTeam = cols.item(6).getContent();
                game.board = cols.item(7).getContent();
            }

            if (Y.Array.indexOf(teams, game.whiteTeam) === -1) {
                teams.push(game.whiteTeam);
            }
            if (Y.Array.indexOf(teams, game.blackTeam) === -1) {
                teams.push(game.blackTeam);
            }

            games.push(game);
        });

        function gamesTeamFilter(team) {
            var newGames = [], isOurTeam, i;

            for (i = 0; i < games.length; i += 1) {
                isOurTeam = games[i].whiteTeam.search(team) !== -1 ||
                    games[i].blackTeam.search(team) !== -1;
                if (isOurTeam) {
                    newGames.push(games[i]);
                }
            }
            gamesDT.set('recordset', newGames);

            Y.fire("teamNameChange", team);
            teamName = team;

            Y.Cookie.set("teamName", teamName);
        }

        teamNode.plug(Y.Plugin.AutoComplete, {
            source: teams,
            resultFilters: 'startsWith',
            maxResults: 15,
            width: 'auto'
        });

        teamNode.focus();

        teamNode.ac.after('resultsChange', function () {
            var newWidth = this.get('boundingBox').get('offsetWidth');
            teamNode.setStyle('width', Math.max(newWidth, 100));
        });

        gamesDT = new Y.DataTable.Base({
            columnset: [
                { key: "when", label: "When ICC",
                    formatter: settingStyles},
                { key: "whenLocal", label: "When Local",
                    formatter: settingStyles},
                { key: "division", label: "Division"},
                { key: "round", label: "R"},
                { key: "whiteTeam", label: "White Team"},
                { key: "whitePlayer", label: "White Player",
                    formatter: settingStyles},
                { key: "blackPlayer", label: "Black Player",
                    formatter: settingStyles},
                { key: "blackTeam", label: "Black Team"},
                { key: "board", label: "B"}
            ],
            recordset: []
        });

        gamesTeamFilter(teamName);

        teamNode.ac.on('query', function(e) {
            gamesTeamFilter(e.query);
        });
        teamNode.ac.on('select', function(e) {
            gamesTeamFilter(e.result.text);
        });

        if (games.length) {
            gamesDT.render("#games");
        } else {
            gamesNode.setContent("Games not scheduled yet.");
        }
    }

    Y.YQL('select * from html where url="' + gamesUrl + '"', myGames,
        { format: 'xml' });
});

