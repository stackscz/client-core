'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.init = init;
var INIT = exports.INIT = '@@client-core/INIT';

function init() {
	return { type: INIT };
}