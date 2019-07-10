const opt = require('./options');
const mapObjectKeys = require('./map-object-keys');

function join(array1, array2, options = {}) {
  const { key, key1, key2, match, propMap1, propMap2 } = options;
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return [];
  }

  const matchItems = opt.getMatchFunction({ key, key1, key2, match });

  if (typeof matchItems !== 'function') {
    return [];
  }

  return array1.reduce((prev, cur) => {
    const matches = array2.filter(a2 => matchItems(cur, a2));
    if (options.as) {
      if (matches.length === 0) {
        return prev;
      }

      cur[options.as] = matches;
      return prev.concat(cur);
    }

    return matches.length === 0
      ? prev
      : prev.concat(
          matches.map(m =>
            Object.assign(
              {},
              mapObjectKeys(m, propMap2),
              mapObjectKeys(cur, propMap1)
            )
          )
        );
  }, []);
}

module.exports = join;
