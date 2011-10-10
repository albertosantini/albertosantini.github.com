/*jslint sloppy:true */
/*global YUI */

YUI({filter: "raw"}).use('model', 'view', function (Y) {
    var model, view;

    Y.TemperatureModel = Y.Base.create('temperatureModel', Y.Model, [], {
        check: function (value) {
            if (Y.Lang.isNumber(value)) {
                return true;
            } else {
                return false;
            }
        },
        round: function (value) {
            return Math.round(value * 1000) / 1000;
        }
    }, {
        ATTRS: {
            fahrenheit: {
                value: 0,
                validator: function (value, what) {
                    return this.check(value, what);
                }
            },
            celsius: {
                value: 0,
                validator: function (value, what) {
                    return this.check(value, what);
                }
            },
            kelvin: {
                value: 0,
                validator: function (value, what) {
                    return this.check(value, what);
                }
            }
        }
    });

    Y.TemperatureView = Y.Base.create('temperatureView', Y.View, [], {
        container: Y.one("#temperatureView"),
        fahrenheitNode: Y.one("#fahrenheit"),
        celsiusNode: Y.one("#celsius"),
        kelvinNode: Y.one("#kelvin"),
        events: {
            '#fahrenheit': { keypress: 'convertFahrenheit' },
            '#celsius': { keypress: 'convertCelsius' },
            '#kelvin': { keypress: 'convertKelvin' }
        },
        initializer: function () {
            var model = this.model;

            model.after('fahrenheitChange', function (e) {
                var value = e.newVal;
                this.set('celsius', this.round((value - 32) * 5 / 9));
                this.set('kelvin', this.round((value + 459.67) * 5 / 9));
            });
            model.after('celsiusChange', function (e) {
                var value = e.newVal;
                this.set('fahrenheit', this.round((value * 9 / 5) + 32));
                this.set('kelvin', this.round(value + 273.15));
            });
            model.after('kelvinChange', function (e) {
                var value = e.newVal;
                this.set('fahrenheit', this.round((value * 9 / 5) - 459.67));
                this.set('celsius', this.round(value - 273.15));
            });

            model.after("change", this.render, this);

            this.fahrenheitNode.set("value", "");
            this.celsiusNode.set("value", "");
            this.kelvinNode.set("value", "");
        },
        render: function () {
            this.fahrenheitNode.set("value", this.model.get('fahrenheit'));
            this.celsiusNode.set("value", this.model.get('celsius'));
            this.kelvinNode.set("value", this.model.get('kelvin'));
        },
        convert: function (e, node) {
            var what, value;

            if (e.keyCode === 13 || e.keyCode === 9) { // enter or tab key
                what = node.get('id');
                value = Y.Lang.trim(node.get('value'));

                if (!value) {
                    return;
                }

                this.model.set(what, parseFloat(value));
            }
        },
        convertFahrenheit: function (e) {
            this.convert(e, this.fahrenheitNode);
        },
        convertCelsius: function (e) {
            this.convert(e, this.celsiusNode);
        },
        convertKelvin: function (e) {
            this.convert(e, this.kelvinNode);
        }
    });

    model = new Y.TemperatureModel();
    view = new Y.TemperatureView({
        model: model
    });
});


