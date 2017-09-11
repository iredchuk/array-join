function mapObjectKeys (obj, mapper) {
  if (!obj || typeof obj !== 'object' || typeof mapper !== 'function') {
    return obj
  }

  return Object.keys(obj).reduce((result, key) =>
    Object.assign(result, { [mapper(key)]: obj[key] }),
    {})
}

module.exports = mapObjectKeys
