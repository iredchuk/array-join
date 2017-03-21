const validateOptions = require('./validate-options');

function leftJoin(array1, array2, { key, key1, key2, match } = {}) {
	if (!Array.isArray(array1)) {
		return [];
	}

	if (!Array.isArray(array2)) {
		return array1.map(a => a);
	}

	const { matchItems } = validateOptions({ key, key1, key2, match });

	if (typeof matchItems !== 'function') {
		return [];
	}

	return array1.reduce((prev, cur) => {
		const matches = array2.filter(a2 => matchItems(cur, a2));
		return matches.length === 0
			? prev.concat(cur)
			: prev.concat(matches.map(m => Object.assign({}, m, cur)));
	}, []);
}

module.exports = leftJoin;
