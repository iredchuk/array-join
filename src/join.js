const options = require('./options')
const mapObjectKeys = require('./map-object-keys')

function join (array1, array2, { key, key1, key2, match, propMap1, propMap2 } = {}) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return []
  }

  const matchItems = options.getMatchFunction({ key, key1, key2, match })

  if (typeof matchItems !== 'function') {
    return []
  }

  return array1.reduce((prev, cur) => {
    const matches = array2.filter(a2 => matchItems(cur, a2))
    return matches.length === 0
      ? prev
      : prev.concat(matches.map(m => Object.assign({},
        mapObjectKeys(m, propMap2),
        mapObjectKeys(cur, propMap1))))
  }, [])
}

module.exports = join
