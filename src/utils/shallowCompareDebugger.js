/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 *
 */

/*eslint-disable*/

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

function printRed(message) {
	console.log('\x1b[31m' + message + '\x1b[0m');
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
	// SameValue algorithm
	if (x === y) {
		// Steps 1-5, 7-10
		// Steps 6.b-6.e: +0 != -0
		// Added the nonzero y check to make Flow happy, but it is redundant
		return x !== 0 || y !== 0 || 1 / x === 1 / y;
	} else {
		// Step 6.a: NaN == NaN
		return x !== x && y !== y;
	}
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function checkShallowEqualErrors(objA, objB) {
	var errors = [];

	if (is(objA, objB)) {
		return errors;
	}

	if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
		errors.push({
			message: 'Provided arguments are not valid'
		});
		return errors;
	}

	var keysA = Object.keys(objA);
	var keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		errors.push({
			message: 'Keys length does not match',
			parameters: {
				firstLength: keysA.length,
				secondLength: keysB.length
			}
		});
	}

	// Test for A's keys different from B.
	for (var i = 0; i < keysA.length; i++) {
		if (!hasOwnProperty.call(objB, keysA[i])) {
			errors.push({
				message: 'Second object does not have property "' + keysA[i] + '" of first object',
				parameters: {
					propertyName: i
				}
			});
		}

		if (!hasOwnProperty.call(objA, keysB[i])) {
			errors.push({
				message: 'First object does not have property "' + keysB[i] + '" of second object',
				parameters: {
					propertyName: i
				}
			});
		}

		if (!is(objA[keysA[i]], objB[keysA[i]])) {
			errors.push({
				message: 'Key "' + keysA[i] + '" does not match',
				parameters: {
					firstObject: objA[keysA[i]],
					secondObject: objB[keysA[i]]
				}
			});
		}
	}

	return errors;
}

function printShallowEqualErrors(objA, objB) {
	var errors = checkShallowEqualErrors(objA, objB);

	if (!errors.length) return false;

	console.log(errors.length + ' errors found\n');
	errors.forEach(function (error, i) {
		printRed((i + 1) + ':' + '\t' + error.message);
	});

	return true;
}

module.exports = {
	checkShallowEqualErrors,
	printShallowEqualErrors
};
