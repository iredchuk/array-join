# array-join
Join arrays of objects by a common key or with a custom match function, similarly to how SQL JOIN and LEFT JOIN work.

[![build status](https://img.shields.io/travis/iredchuk/array-join/master.svg?style=flat-square)](https://travis-ci.org/iredchuk/array-join)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

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
### leftJoin(array1, array2, options)
```js
options = {
  key1,  // key property in the array1 objects to join objects on
  key2,  // key property in the array2 objects to join objects on
  key,  // common join key (when key1 is the same as key2)
  propMap1,  // function to rename properties of the array1 objects
  propMap2,  // function to rename properties of the array2 objects
  match  // custom match function to join objects in arrays
};
```

### Examples

> join objects on the common key property:
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

> join objects on different key properties:
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

> object properties can be renamed to avoid possible collisions:
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
  { key: 'id', propMap1: p => 'l_' + p, propMap2: p => 'r_' + p });

console.log(result);

/*
[
  { l_id: 2, r_id: 2, l_name: 'banana', r_name: 'Venus' },
  { l_id: 3, r_id: 2, l_name: 'orange', r_name: 'Mars' }
]
*/
```

> join objects with a custom match function:
```js
const result = join([
    { id: '100', name: 'one' },
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

> left-join adds all items from the left array to the result (even if they don't match):
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
  { id: 3, name: 'orange' },
  { id: 4, name: 'apricot' }
]
*/
```
