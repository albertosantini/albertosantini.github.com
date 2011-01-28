/*global YAHOO */

YAHOO.util.Event.onDOMReady(function () {
    var documentModel, view;

    //
    // Document
    //

    function TemperatureDocument() {
        // These variables and the internal functions declared below are private
        var self = this,
            F = 'Fahrenheit',
            C = 'Celsius',
            K = 'Kelvin';

        // Labels are read only
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

        // I use the validator functionality so that if the new value is just
        // a rounding error away from the stored value, it won't take it
        // and won't trigger change events
        // This prevents the whole thing from entering a loop
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


    function TemperatureView(documentModel) {

        this.getField = function (label, container) {
            var labelField, field;

            labelField = new YAHOO.inputEx.UneditableField({
                value: label,
                parentEl: container
            });
            field = new YAHOO.inputEx.NumberField({
                value: '',
                parentEl: container
            });

            field.documentItemName = label;

            field.updatedEvt.subscribe(function (e, params) {
                var value = params[0];
                documentModel.set(this.documentItemName, value);
            });


            documentModel.subscribe(label + 'Change', function (ev) {
                this.setValue(ev.newValue);
            }, field, true);

            return field;
        };

        this.getForm = function (container) {
            var title = new YAHOO.inputEx.UneditableField({
                value: "Pick a field and type a temperature "
                    + "and press enter (or tab) to convert.<br /><br />",
                parentEl: container
            });

            this.getField(documentModel.get('FahrenheitLabel'), container);
            this.getField(documentModel.get('CelsiusLabel'), container);
            this.getField(documentModel.get('KelvinLabel'), container);
        };

    }

    //
    // Main
    //

    documentModel = new TemperatureDocument();
    view = new TemperatureView(documentModel);

    view.getForm("temperatureForm");
});

