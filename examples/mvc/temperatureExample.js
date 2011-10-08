/*jslint sloppy:true, unparam:true */
/*global YAHOO */

YAHOO.util.Event.onDOMReady(function () {
    var documentModel, view;

    //
    // Document
    //

    function TemperatureDocument() {
        var self = this,
            F = 'Fahrenheit',
            C = 'Celsius',
            K = 'Kelvin';

        this.setAttributeConfig('FahrenheitLabel', {
            value: F,
            readOnly: true
        });
        this.setAttributeConfig('CelsiusLabel', {
            value: C,
            readOnly: true
        });
        this.setAttributeConfig('KelvinLabel', {
            value: K,
            readOnly: true
        });

        // Validator checks if the new value is just a rounding error away
        // from the stored value: it won't take it and won't trigger change
        // events, preventing the whole thing from entering a loop
        function check(what, value) {
            if (YAHOO.lang.isNumber(value)) {
                if (value === 0) {
                    return true;
                } else {
                    return Math.abs(value - self.get(what)) > 0.001;
                }
            }
        }

        this.setAttributeConfig(F, {
            value: 0,
            validator: function (value) {
                return check(F, value);
            }
        });
        this.setAttributeConfig(C, {
            value: 0,
            validator: function (value) {
                return check(C, value);
            }
        });
        this.setAttributeConfig(K, {
            value: 0,
            validator: function (value) {
                return check(K, value);
            }
        });

        // round will be reached by closure from the functions below.
        function round(value) {
            return Math.round(value * 1000) / 1000;
        }

        // Related values also change by event notification
        this.subscribe('CelsiusChange', function (oArgs) {
            var value = oArgs.newValue;
            this.set(F, round((value * 9 / 5) + 32));
            this.set(K, round(value + 273.15));
        });
        this.subscribe('KelvinChange', function (oArgs) {
            var value = oArgs.newValue;
            this.set(F, round((value * 9 / 5) - 459.67));
            this.set(C, round(value - 273.15));
        });
        this.subscribe('FahrenheitChange', function (oArgs) {
            var value = oArgs.newValue;
            this.set(C, round((value - 32) * 5 / 9));
            this.set(K, round((value + 459.67) * 5 / 9));
        });
    }

    YAHOO.lang.extend(TemperatureDocument, YAHOO.util.AttributeProvider);

    //
    // View
    //

    function TemperatureView(model) {

        this.getField = function (label, field) {
            var fld = YAHOO.util.Dom.get(field);

            YAHOO.util.Event.addListener(fld, "change", function (e) {
                model.set(label, e.target.value);
                model.fireEvent(label + 'Change', {
                    newValue: parseInt(e.target.value, 10)
                });
            });

            model.subscribe(label + 'Change', function (ev) {
                this.value = ev.newValue;
            }, fld, true);

            return fld;
        };

        this.getField(model.get('FahrenheitLabel'), "fahrenheit");
        this.getField(model.get('CelsiusLabel'), "celsius");
        this.getField(model.get('KelvinLabel'), "kelvin");
    }

    //
    // Main
    //

    documentModel = new TemperatureDocument();
    view = new TemperatureView(documentModel);
});

