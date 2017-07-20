(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ArrayJoin = factory());
}(this, (function () { 'use strict';

function getMatchFunction(_ref) {
  var key = _ref.key,
      key1 = _ref.key1,
      key2 = _ref.key2,
      match = _ref.match;

  if (typeof match === 'function') {
    return match;
  }

  var k1 = key1 || key;
  var k2 = key2 || key;

  if (!k1 || !k2) {
    return undefined;
  }

  return function (a, b) {
    return a[k1] === b[k2] && a[k1] !== undefined;
  };
}

var options = {
  getMatchFunction: getMatchFunction
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function mapObjectKeys(obj, mapper) {
  if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || typeof mapper !== 'function') {
    return obj;
  }

  var keys = Object.keys(obj);

  if (keys.length === 0) {
    return obj;
  }

  return keys.reduce(function (result, key) {
    var _Object$assign;

    return Object.assign(result, (_Object$assign = {}, _Object$assign[mapper(key)] = obj[key], _Object$assign));
  }, {});
}

function join(array1, array2) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      key = _ref.key,
      key1 = _ref.key1,
      key2 = _ref.key2,
      match = _ref.match,
      propMap1 = _ref.propMap1,
      propMap2 = _ref.propMap2;

  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return [];
  }

  var matchItems = options.getMatchFunction({ key: key, key1: key1, key2: key2, match: match });

  if (typeof matchItems !== 'function') {
    return [];
  }

  return array1.reduce(function (prev, cur) {
    var matches = array2.filter(function (a2) {
      return matchItems(cur, a2);
    });
    return matches.length === 0 ? prev : prev.concat(matches.map(function (m) {
      return Object.assign({}, mapObjectKeys(m, propMap2), mapObjectKeys(cur, propMap1));
    }));
  }, []);
}

function leftJoin(array1, array2) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      key = _ref.key,
      key1 = _ref.key1,
      key2 = _ref.key2,
      match = _ref.match,
      propMap1 = _ref.propMap1,
      propMap2 = _ref.propMap2;

  if (!Array.isArray(array1)) {
    return [];
  }

  if (!Array.isArray(array2)) {
    return array1.map(function (a) {
      return a;
    });
  }

  var matchItems = options.getMatchFunction({ key: key, key1: key1, key2: key2, match: match });

  if (typeof matchItems !== 'function') {
    return [];
  }

  return array1.reduce(function (prev, cur) {
    var matches = array2.filter(function (a2) {
      return matchItems(cur, a2);
    });
    return matches.length === 0 ? prev.concat(mapObjectKeys(cur, propMap1)) : prev.concat(matches.map(function (m) {
      return Object.assign({}, mapObjectKeys(m, propMap2), mapObjectKeys(cur, propMap1));
    }));
  }, []);
}

var index = {
  join: join,
  leftJoin: leftJoin
};

return index;

})));
