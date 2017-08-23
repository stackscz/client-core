'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.checkConnection = checkConnection;
var CHECK_CONNECTION = exports.CHECK_CONNECTION = 'client-core/connectionSentry/CHECK_CONNECTION';
function checkConnection() {
	return { type: CHECK_CONNECTION };
}