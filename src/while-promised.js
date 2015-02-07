
/**
 * Loops the function until stopvalue is met
 * @param  {Function} fn        Function to run
 * @param  {Mixed}  stopValue   Function returning false to stop or a value to stop at if === with resolved value
 * @return {Promise}            Returns a Promise
 */
function loopFunction(fn, stopValue = false) {

	let stopFunction = (typeof stopValue === 'function' ? stopValue : value => value !== stopValue);

	return fn.call()
		.then(value => {
			if(stopFunction(value)) {
				return loopFunction(fn, stopValue);
			}

			return value;
		});
}

export default function(fn, stopValue) {
	return loopFunction(fn, stopValue);
};