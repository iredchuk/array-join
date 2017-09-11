function getMatchFunction ({ key, key1, key2, match }) {
  if (typeof match === 'function') {
    return match
  }

  const k1 = key1 || key
  const k2 = key2 || key

  if (!k1 || !k2) {
    return undefined
  }

  return (a, b) => a[k1] === b[k2] && a[k1] !== undefined
}

module.exports = {
  getMatchFunction
}
