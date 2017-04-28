# array-join
Join arrays by common key or with custom matching function, similarly to how SQL JOIN and LEFT JOIN work.

[![build status](https://img.shields.io/travis/iredchuk/array-join/master.svg?style=flat-square)](https://travis-ci.org/iredchuk/array-join)

## Installation
```console
$ npm install array-join
```
or
```console
$ yarn add array-join
```

## Usage

### join(array1, array2, options)
> with common key:
```js
const join = require('array-join').join;

const result = join([
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' }
  ],
  [
    { id: 1, color: 'red' },
    { id: 2, color: 'yellow' },
    { id: 4, color: 'blue' }
  ],
  { key: 'id' });

console.log(result);

/*
[
  { id: 1, name: 'apple', color: 'red' },
  { id: 2, name: 'banana', color: 'yellow' }
]
*/
```

> with different matching keys:
```js
const result = join([
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' }
  ],
  [
    { num: 1, color: 'red' },
    { num: 2, color: 'yellow' },
    { num: 4, color: 'blue' }
  ],
  { key1: 'id', key2: 'num' });

console.log(result);

/*
[
  { id: 1, name: 'apple', color: 'red' },
  { id: 2, name: 'banana', color: 'yellow' }
]
*/
```

> with custom matching function:
```js
const result = join([
    { id: '100', name: 'one },
    { id: '200', name: 'two' },
    { id: '300', name: 'three' }
  ],
  [
    { index: 1 },
    { index: 2 },
    { index: 3 }
  ],
  {
    match: (left, right) => Number(left.id) === 100 * right.index
  });

console.log(result);

/*
[
  { id: '100', name: 'one', index: 1 },
  { id: '200', name: 'two', index: 2 },
  { id: '300', name: 'three', index: 3 }
]
*/
```

> object keys can be prefixed to avoid possible collisions:
```js
const result = join([
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' }
  ],
  [
    { id: 2, name: 'Venus' },
    { id: 3, name: 'Mars' },
    { id: 4, name: 'Jupiter' }
  ],
  { key: 'id', prefix1: 'l_', prefix2: 'r_' });

console.log(result);

/*
[
  { l_id: 2, r_id: 2, l_name: 'banana', r_name: 'Venus' },
  { l_id: 3, r_id: 2, l_name: 'orange', r_name: 'Mars' }
]
*/
```

### leftJoin(array1, array2, options)
```js
const leftJoin = require('array-join').leftJoin;

const result = leftJoin([
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' },
    { id: 4, name: 'apricot' }
  ],
  [
    { id: 1, color: 'red' },
    { id: 2, color: 'yellow' },
    { id: 5, color: 'blue' }
  ],
  { key: 'id' });

console.log(result);

/*
[
  { id: 1, name: 'apple', color: 'red' },
  { id: 2, name: 'banana', color: 'yellow' },
  // leftJoin adds all items from the left array,
  // no matter if they match or not:
  { id: 3, name: 'orange' },
  { id: 4, name: 'apricot' }
]
*/
```

> All options applicable to `join` work also for `leftJoin`.
