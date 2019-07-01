"use strict";
var intl = require('@telerik/kendo-intl');
var error_solutions_1 = require('./error-solutions');
function formatMessage(error) {
    var message = error.message;
    var errorSolution = error_solutions_1.errorSolutions[Object.keys(error_solutions_1.errorSolutions).filter(function (key) { return message.indexOf(key) === 0; })[0]];
    return errorSolution ? message + " " + errorSolution : message;
}
function intlMethod(fn) {
    return function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i - 0] = arguments[_i];
        }
        try {
            return fn.apply(null, values);
        }
        catch (error) {
            error.message = formatMessage(error);
            throw error;
        }
    };
}
/**
 * @hidden
 */
exports.dateFormatNames = intlMethod(intl.dateFormatNames);
/**
 * @hidden
 */
exports.dateFormatString = intlMethod(intl.dateFormatString);
/**
 * @hidden
 */
exports.firstDay = intlMethod(intl.firstDay);
/**
 * @hidden
 */
exports.format = intlMethod(intl.format);
/**
 * @hidden
 */
exports.formatDate = intlMethod(intl.formatDate);
/**
 * @hidden
 */
exports.formatNumber = intlMethod(intl.formatNumber);
/**
 * @hidden
 */
exports.load = intlMethod(intl.load);
/**
 * @hidden
 */
exports.numberSymbols = intlMethod(intl.numberSymbols);
/**
 * @hidden
 */
exports.parseDate = intlMethod(intl.parseDate);
/**
 * @hidden
 */
exports.parseNumber = intlMethod(intl.parseNumber);
/**
 * @hidden
 */
exports.toString = intlMethod(intl.toString);
