YUI({
    'yui2': '2.9.0',
    '2in3': '4'
}).use("yui2-yahoo",
    "yui2-dom",
    "yui2-event",
    "yui2-datasource",
    "yui2-autocomplete", function (Y) {

    var YAHOO = Y.YUI2, oDS, oAC, enterKey;

    // Define a custom search function for the DataSource
    function matchNames(sQuery) {
        // Case insensitive matching
        var query = sQuery.toLowerCase(),
            player,
            i=0,
            l=myPlayers.length,
            matches = [];

        // Match against each name of each contact
        for(; i < l; i++) {
            player = myPlayers[i];
            if((player.fname.toLowerCase().indexOf(query) > -1) ||
                (player.lname.toLowerCase().indexOf(query) > -1) ||
                (player.nmber &&
                    (player.nmber.toLowerCase().indexOf(query) > -1))) {
                matches[matches.length] = player;
            }
        }

        return matches;
    }

    // Use a FunctionDataSource
    oDS = new YAHOO.util.FunctionDataSource(matchNames);
    oDS.responseSchema = {
        fields: ["id", "nmber", "position", "fname", "lname"]
    };

    // Instantiate AutoComplete
    oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
    oAC.useShadow = true;
    oAC.resultTypeList = false;
    // oAC.minQueryLength = 2;
    oAC.autoHighlight = true;
    oAC.delimChar = " ";

    YAHOO.widget.AutoComplete.prototype._updateValue = function(elListItem) {
        if(!this.suppressInputUpdate) {
            var elTextbox = this._elTextbox;
            var sDelimChar = (this.delimChar) ? (this.delimChar[0] || this.delimChar) : null;
            var sResultMatch = elListItem._sResultMatch;

            // Calculate the new value
            var sNewValue = "";
            if(sDelimChar) {
                // Preserve selections from past queries
                sNewValue = this._sPastSelections;
                // Add new selection plus delimiter
                // sNewValue += sResultMatch + sDelimChar; // LINE MODIFIED
                if(sDelimChar != " ") {
                    sNewValue += " ";
                }
            }
            else {
                sNewValue = sResultMatch;
            }

            // Update input field
            elTextbox.value = sNewValue;

            // Scroll to bottom of textarea if necessary
            if(elTextbox.type == "textarea") {
                elTextbox.scrollTop = elTextbox.scrollHeight;
            }

            // Move cursor to end
            var end = elTextbox.value.length;
            this._selectText(elTextbox,end,end);

            this._elCurListItem = elListItem;
        }
    };

    // Helper function for the formatter
    function highlightMatch(full, snippet, matchindex) {
        return full.substring(0, matchindex) +
                "<span class='match'>" +
                full.substr(matchindex, snippet.length) +
                "</span>" +
                full.substring(matchindex + snippet.length);
    }

    // Custom formatter to highlight the matching letters
    oAC.formatResult = function(oResultData, sQuery, sResultMatch) {
        var query = sQuery.toLowerCase(),
            fname = oResultData.fname,
            lname = oResultData.lname,
            nmber = oResultData.nmber || "", // Guard against null value
            position = oResultData.position || "", // Guard against null value
            fnameMatchIndex = fname.toLowerCase().indexOf(query),
            lnameMatchIndex = lname.toLowerCase().indexOf(query),
            nmberMatchIndex = nmber.toLowerCase().indexOf(query),
            displayfname, displaylname, displaynmber;

        if (fnameMatchIndex > -1) {
            displayfname = highlightMatch(fname, query, fnameMatchIndex);
        }
        else {
            displayfname = fname;
        }

        if (lnameMatchIndex > -1) {
            displaylname = highlightMatch(lname, query, lnameMatchIndex);
        }
        else {
            displaylname = lname;
        }

        if (nmberMatchIndex > -1) {
            displaynmber = highlightMatch(nmber, query, nmberMatchIndex);
        }
        else {
            displaynmber = nmber;
        }

        return displaylname + " " + displayfname + " - #"  +
            displaynmber + " - " + position;
    };

    function myHandler(sType, aArgs) {
        var myAC = aArgs[0], // reference back to the AC instance
            elLI = aArgs[1], // reference to the selected LI element
            oData = aArgs[2]; // object literal of selected item's result data

        myAC.getInputEl().value += oData.lname + " " + oData.fname ;
    }
    oAC.itemSelectEvent.subscribe(myHandler);

    enterKey = new YAHOO.util.KeyListener(oAC.getInputEl(), {keys: 13}, {
        fn: function () {
            alert(oAC.getInputEl().value);
        },
    }, 'keydown');
    enterKey.enable();

    oAC.getInputEl().focus();
});
