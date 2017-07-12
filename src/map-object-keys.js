function mapObjectKeys (obj, mapper) {
  if (!obj || typeof obj !== 'object' || typeof mapper !== 'function') {
    return obj
  }

  const keys = Object.keys(obj)

  if (keys.length === 0) {
    return obj
  }

  return keys.reduce((result, key) =>
    Object.assign(result, { [mapper(key)]: obj[key] }),
    {})
}

export default mapObjectKeys
