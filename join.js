const validateOptions = require('./validate-options');
const prefixKeys = require('./prefix-keys');

function join(array1, array2, { key, key1, key2, match, prefix1, prefix2 } = {}) {
	if (!Array.isArray(array1) || !Array.isArray(array2)) {
		return [];
	}

	const { matchItems } = validateOptions({ key, key1, key2, match });

	if (typeof matchItems !== 'function') {
		return [];
	}

	return array1.reduce((prev, cur) => {
		const matches = array2.filter(a2 => matchItems(cur, a2));
		return matches.length === 0
			? prev
			: prev.concat(matches.map(m => Object.assign({}, prefixKeys(m, prefix2), prefixKeys(cur, prefix1))));
	}, []);
}

module.exports = join;
