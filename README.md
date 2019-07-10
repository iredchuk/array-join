# array-join

Join arrays of objects by a common key or with a custom match function, similarly to how SQL JOIN, LEFT JOIN and FULL JOIN work.

[![build status](https://img.shields.io/travis/iredchuk/array-join/master.svg?style=flat-square)](https://travis-ci.org/iredchuk/array-join)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

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

### fullJoin(array1, array2, options)

```js
options = {
  key1, // key property in the array1 objects to join objects on
  key2, // key property in the array2 objects to join objects on
  key, // common join key (when key1 is the same as key2)
  propMap1, // function to rename properties of the array1 objects
  propMap2, // function to rename properties of the array2 objects
  match, // custom match function to join objects in arrays
  as, // specifies the name of the new array field to add to the array1 objects. The new array field contains the matching objects from the array2. If the specified name already exists in the array1 objects, the existing field is overwritten.
};
```

### Examples

> join objects on the common key property:

```js
const join = require('array-join').join;

const result = join(
  [
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' }
  ],
  [
    { id: 1, color: 'red' },
    { id: 2, color: 'yellow' },
    { id: 4, color: 'blue' }
  ],
  { key: 'id' }
);

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
const result = join(
  [
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' }
  ],
  [
    { num: 1, color: 'red' },
    { num: 2, color: 'yellow' },
    { num: 4, color: 'blue' }
  ],
  { key1: 'id', key2: 'num' }
);

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
const result = join(
  [
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' }
  ],
  [
    { id: 2, name: 'Venus' },
    { id: 3, name: 'Mars' },
    { id: 4, name: 'Jupiter' }
  ],
  { key: 'id', propMap1: p => 'l_' + p, propMap2: p => 'r_' + p }
);

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
const result = join(
  [
    { id: '100', name: 'one' },
    { id: '200', name: 'two' },
    { id: '300', name: 'three' }
  ],
  [{ index: 1 }, { index: 2 }, { index: 3 }],
  {
    match: (left, right) => Number(left.id) === 100 * right.index
  }
);

console.log(result);

/*
[
  { id: '100', name: 'one', index: 1 },
  { id: '200', name: 'two', index: 2 },
  { id: '300', name: 'three', index: 3 }
]
*/
```

> leftJoin adds all items from the left array to the result (even if they don't match):

```js
const leftJoin = require('array-join').leftJoin;

const result = leftJoin(
  [
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
  { key: 'id' }
);

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

> use 'as' options leftJoin adds all items from the left array to the result (even if they don't match):

```js
const result = leftJoin(
  [
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' },
  ],
  [
    { id: 1, color: 'red' },
    { id: 1, color: 'red2' },
    { id: 2, color: 'yellow' },
  ],
  { key: 'id', as: 'joinData' }
);

console.log(result);

/*
[
  { "id": 1, "name": "apple", "joinData": [ { "id": 1, "color": "red" }, { "id": 1, "color": "red2" } ] },
  { "id": 2, "name": "banana", "joinData": [ { "id": 2, "color": "yellow" } ] },
  { "id": 3, "name": "orange", "joinData": [] }
]
*/
```

> fullJoin adds all items from both arrays to the result, merging only ones that match:

```js
const fullJoin = require('array-join').fullJoin;

const result = fullJoin(
  [
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' }
  ],
  [
    { id: 1, color: 'red' },
    { id: 2, color: 'yellow' },
    { id: 4, color: 'blue' }
  ],
  { key: 'id' }
);

console.log(result);

/*
[
  { id: 1, name: 'apple', color: 'red' },
  { id: 2, name: 'banana', color: 'yellow' },
  { id: 3, name: 'orange' },
  { id: 4, color: 'blue' }
]
*/
```
