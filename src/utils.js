/** Asynchronously foreach an Array
 * @param  {array|map|set} array
 * @param  {function} callback
 */
async function asyncForEach(array, callback) {
	let index = -1;
	// the entire friggin' point of this function is this problem
	// eslint-disable-next-line no-restricted-syntax
	for await (const value of array) {
		index += 1;
		await callback(value, index, array);
	}
}

/** Converts n days into milliseconds
 * @param  {number} days an integer
 *
 * @returns {number} days converted to ms
 */
function getDaysAsMs(days) {
    return ((((60 * 60) * 24) * days) * 1000);
}

/**
 * @param  {number} days an integer
 *
 * @returns {number} a unix time in ms 
 */
function getTimeNDaysAgo(days) {
    const msAgo = getDaysAsMs(days);
    const now = Date.now();
    const daysAgo = new Date();

    daysAgo.setTime(now - msAgo);

    return daysAgo.getTime();
}

module.exports = {
    asyncForEach,
    getDaysAsMs,
    getTimeNDaysAgo,
}