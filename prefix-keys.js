function prefixKeys(obj, prefix) {
	if (!obj || typeof obj !== 'object' || !prefix) {
		return obj;
	}

	const keys = Object.keys(obj);

	if (keys.length === 0) {
		return obj;
	}

	return keys.reduce((result, key) => Object.assign(result, { [prefix + key]: obj[key] }), {});
}

module.exports = prefixKeys;
