const options = require('./options');
const mapObjectKeys = require('./map-object-keys');

function join(array1, array2, {key, key1, key2, match, prefix1, prefix2} = {}) {
	if (!Array.isArray(array1) || !Array.isArray(array2)) {
		return [];
	}

	const matchItems = options.getMatchFunction({key, key1, key2, match});

	if (typeof matchItems !== 'function') {
		return [];
	}

	return array1.reduce((prev, cur) => {
		const matches = array2.filter(a2 => matchItems(cur, a2));
		return matches.length === 0 ?
			prev :
			prev.concat(matches.map(m => Object.assign({},
				mapObjectKeys(m, prefix2 ? key => prefix2 + key : undefined),
				mapObjectKeys(cur, prefix1 ? key => prefix1 + key : undefined))));
	}, []);
}

module.exports = join;
