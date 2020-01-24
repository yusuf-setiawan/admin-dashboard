const underscore = require("underscore.string");
const numeral = require('numeral');
// This is your plugin object. It can be exported to be used anywhere.
export default function(Vue) {

    Vue.prototype.$underscore = underscore;
    Vue.prototype.$numeral = numeral;

    Vue.filter('humanize', underscore.humanize);
    Vue.filter('decimal', function(value, format = '0,0[.][000000]') {
        if (!value) return '0';
        return numeral(value).format(format)
    });

    Vue.filter('money', function(source, places = 0, symbol = "Rp. ", thousand = ".", decimal = ",") {
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "Rp. ";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var number = source,
            negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    })

    Vue.filter('status_badge', function(value) {
        if (value === 'pending')
            return "m-badge m-badge--metal m-badge--wide"
        else if (value === 'active' || value === 'confirmed' || value === 'enabled')
            return "m-badge m-badge--success m-badge--wide"
        else if (value === 'partial')
            return "m-badge m-badge--warning m-badge--wide"
        else if (value === 'complete')
            return "m-badge m-badge--brand m-badge--wide"
        else if (value === 'void')
            return "m-badge m-badge--danger m-badge--wide"
    })

}