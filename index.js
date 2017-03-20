function join(array1, array2, { key, key1, key2, match } = {}) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return [];
  }

  const { doMatch } = validateOptions({ key, key1, key2, match });

  if (typeof doMatch !== 'function') {
    return [];
  }

  return array1.reduce((prev, cur) => {
    const matches = array2.filter(a2 => doMatch(cur, a2));
    return matches.length === 0 ?
      prev :
      prev.concat(matches.map(m => Object.assign({}, m, cur)))
  }, []);
}

function validateOptions({ key, key1, key2, match }) {
  const k1 = key1 || key;
  const k2 = key2 || key;

  let doMatch = match;
  if (typeof doMatch !== 'function') {
    if (!k1 || !k2) {
      doMatch = undefined;
    }
    doMatch = (a, b) => a[k1] === b[k2] && a[k1] !== undefined;
  }

  return {
    doMatch
  };
}

module.exports = { join };
