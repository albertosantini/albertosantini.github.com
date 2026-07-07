(function () {
    "use strict";

    var HOME_FILE = "README.md";
    var SITE_TITLE = "Alberto Santini";
    var entries = [];
    var currentFile = HOME_FILE;

    var content = document.getElementById("content");
    var pager = document.querySelector(".pager");
    var previousLink = document.getElementById("previousLink");
    var nextLink = document.getElementById("nextLink");
    var previousText = document.getElementById("previousText");
    var nextText = document.getElementById("nextText");

    marked.setOptions({
        gfm: true,
        breaks: false
    });

    initEvents();
    boot();

    function initEvents() {
        window.addEventListener("hashchange", renderRoute);

        document.addEventListener("click", function (event) {
            var link = event.target.closest("a");

            if (!link) {
                return;
            }

            var href = link.getAttribute("href");
            if (href && href.endsWith(".md")) {
                event.preventDefault();
                location.hash = routeForFile(href);
            }
        });
    }

    function boot() {
        content.innerHTML = '<p class="loading">Caricamento...</p>';

        fetchJson("texts.json")
            .then(function (items) {
                entries = items;
                renderRoute();
            })
            .catch(function () {
                showError("Non riesco a caricare l'indice dei testi.");
            });
    }

    function renderRoute() {
        var file = fileFromHash(location.hash);
        var known = entries.some(function (entry) {
            return entry.file === file;
        });

        currentFile = known ? file : HOME_FILE;
        content.classList.toggle("is-home", currentFile === HOME_FILE);
        setPager();

        content.innerHTML = '<p class="loading">Caricamento...</p>';

        fetchText(currentFile)
            .then(function (markdown) {
                var html = marked.parse(markdown);

                if (currentFile === HOME_FILE) {
                    html += renderHomeIndex();
                } else {
                    html = renderPageHeader(currentFile) + html;
                }

                content.innerHTML = html;
                rewriteMarkdownLinks();
                document.title = pageTitle(currentFile) + " | " + SITE_TITLE;
                window.scrollTo({ top: 0, behavior: "auto" });
            })
            .catch(function () {
                showError("Non riesco a caricare " + currentFile + ".");
            });
    }

    function fetchText(path) {
        return fetch(path).then(function (response) {
            if (!response.ok) {
                throw new Error("Cannot load " + path);
            }

            return response.text();
        });
    }

    function fetchJson(path) {
        return fetch(path).then(function (response) {
            if (!response.ok) {
                throw new Error("Cannot load " + path);
            }

            return response.json();
        });
    }

    function fileFromHash(hash) {
        var value = decodeURIComponent((hash || "").replace(/^#\/?/, ""));

        if (!value || value === "/") {
            return HOME_FILE;
        }

        return value.endsWith(".md") ? value : value + ".md";
    }

    function routeForFile(file) {
        if (file === HOME_FILE) {
            return "#/";
        }

        return "#/" + encodeURIComponent(file.replace(/\.md$/, ""));
    }

    function setPager() {
        pager.hidden = currentFile === HOME_FILE;

        var index = entries.findIndex(function (entry) {
            return entry.file === currentFile;
        });
        var previous = index > 0 ? entries[index - 1] : null;
        var next = index >= 0 && index < entries.length - 1 ? entries[index + 1] : null;

        updatePagerLink(previousLink, previousText, previous);
        updatePagerLink(nextLink, nextText, next);
    }

    function updatePagerLink(link, label, entry) {
        if (!entry) {
            link.setAttribute("aria-disabled", "true");
            link.href = "#";
            label.textContent = "";
            return;
        }

        link.removeAttribute("aria-disabled");
        link.href = routeForFile(entry.file);
        label.textContent = entry.title;
    }

    function pageTitle(file) {
        var entry = entries.find(function (item) {
            return item.file === file;
        });

        return entry ? entry.title : SITE_TITLE;
    }

    function renderPageHeader(file) {
        return (
            '<header class="page-header">' +
            "<h1>" +
            escapeHtml(pageTitle(file)) +
            "</h1>" +
            '<a class="page-home-link" href="#/" aria-label="Torna all&#39;indice dei testi">Alberto Santini</a>' +
            "</header>"
        );
    }

    function renderHomeIndex() {
        var items = entries
            .filter(function (entry) {
                return entry.file !== HOME_FILE;
            })
            .map(function (entry) {
                var year = (entry.file.match(/^(\d{4})/) || ["", ""])[1];
                return (
                    "<li><a href=\"" +
                    routeForFile(entry.file) +
                    '"><span class="home-index-title">' +
                    escapeHtml(entry.title) +
                    '</span><span class="home-index-rule" aria-hidden="true"></span><span class="home-index-year">' +
                    escapeHtml(year) +
                    "</span></a></li>"
                );
            })
            .join("");

        return (
            '<section class="home-index" aria-label="Indice dei testi">' +
            "<h2>Indice</h2>" +
            '<ul class="home-index-list">' +
            items +
            "</ul>" +
            "</section>"
        );
    }

    function rewriteMarkdownLinks() {
        Array.prototype.forEach.call(content.querySelectorAll('a[href$=".md"]'), function (link) {
            link.href = routeForFile(link.getAttribute("href"));
        });
    }

    function showError(message) {
        content.innerHTML = '<p class="error">' + escapeHtml(message) + "</p>";
        document.title = SITE_TITLE;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
})();
