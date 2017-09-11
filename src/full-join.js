const options = require('./options')
const mapObjectKeys = require('./map-object-keys')

function fullJoin (array1, array2, { key, key1, key2, match, propMap1, propMap2 } = {}) {
  if (!Array.isArray(array1)) {
    return []
  }

  if (!Array.isArray(array2)) {
    return array1.map(a => a)
  }

  const matchItems = options.getMatchFunction({ key, key1, key2, match })

  if (typeof matchItems !== 'function') {
    return []
  }

  const matchedIndices2 = []

  const leftJoin = array1.reduce((prev, cur) => {
    const matches = array2.filter((a2, index) => {
      const isMatch = matchItems(cur, a2)
      if (isMatch) {
        matchedIndices2.push(index)
      }
      return isMatch
    })

    return matches.length === 0
      ? prev.concat(mapObjectKeys(cur, propMap1))
      : prev.concat(matches.map(m => Object.assign({},
        mapObjectKeys(m, propMap2),
        mapObjectKeys(cur, propMap1))))
  }, [])

  const unmatchedItemsFrom2 = array2
    .filter((a2, index) => !matchedIndices2.includes(index))
    .map(a2 => mapObjectKeys(a2, propMap2))

  return leftJoin.concat(unmatchedItemsFrom2)
}

module.exports = fullJoin
