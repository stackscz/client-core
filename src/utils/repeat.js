/**
 * Utility to create array with x undefined items, accepts callback for returning custom item at specified index
 *
 * @param {number} repeatCount
 * @param {function} callback
 * @returns {array}
 */
export default (repeatCount, callback) => {
	const arr = Array.apply(null, { length: repeatCount });
	return callback ? arr.map((_, i) => callback(i)) : arr;
};
