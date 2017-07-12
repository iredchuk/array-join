(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ArrayJoin = factory());
}(this, (function () { 'use strict';

function getMatchFunction ({key, key1, key2, match}) {
  if (typeof match === 'function') {
    return match
  }

  const k1 = key1 || key;
  const k2 = key2 || key;

  if (!k1 || !k2) {
    return undefined
  }

  return (a, b) => a[k1] === b[k2] && a[k1] !== undefined
}

var options = {
  getMatchFunction
};

function mapObjectKeys (obj, mapper) {
  if (!obj || typeof obj !== 'object' || typeof mapper !== 'function') {
    return obj
  }

  const keys = Object.keys(obj);

  if (keys.length === 0) {
    return obj
  }

  return keys.reduce((result, key) =>
		Object.assign(result, {[mapper(key)]: obj[key]}),
		{})
}

function join (array1, array2, {key, key1, key2, match, propMap1, propMap2} = {}) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return []
  }

  const matchItems = options.getMatchFunction({key, key1, key2, match});

  if (typeof matchItems !== 'function') {
    return []
  }

  return array1.reduce((prev, cur) => {
    const matches = array2.filter(a2 => matchItems(cur, a2));
    return matches.length === 0
			? prev
			: prev.concat(matches.map(m => Object.assign({},
				mapObjectKeys(m, propMap2),
				mapObjectKeys(cur, propMap1))))
  }, [])
}

function leftJoin (array1, array2, {key, key1, key2, match, propMap1, propMap2} = {}) {
  if (!Array.isArray(array1)) {
    return []
  }

  if (!Array.isArray(array2)) {
    return array1.map(a => a)
  }

  const matchItems = options.getMatchFunction({key, key1, key2, match});

  if (typeof matchItems !== 'function') {
    return []
  }

  return array1.reduce((prev, cur) => {
    const matches = array2.filter(a2 => matchItems(cur, a2));
    return matches.length === 0
			? prev.concat(mapObjectKeys(cur, propMap1))
			: prev.concat(matches.map(m => Object.assign({},
				mapObjectKeys(m, propMap2),
				mapObjectKeys(cur, propMap1))))
  }, [])
}

var index = {
  join,
  leftJoin
};

return index;

})));
