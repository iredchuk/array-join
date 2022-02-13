# array-join

Join arrays of objects by a common key or with a custom match function, similarly to how SQL JOIN, LEFT JOIN and FULL JOIN work.

[![build status](https://img.shields.io/travis/iredchuk/array-join/master.svg?style=flat-square)](https://travis-ci.org/iredchuk/array-join)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Installation

```sh
npm install array-join
```

or

```sh
yarn add array-join
```

## Usage

`join(leftArray, rightArray, getLeftKey, getRightKey, getResultItem)`

`leftJoin(leftArray, rightArray, getLeftKey, getRightKey, getResultItem)`

`fullJoin(leftArray, rightArray, getLeftKey, getRightKey, getResultItem)`

- `leftArray`, `rightArray` - arrays to join

- `getLeftKey`, `getRightKey` - functions to extract the key to join on from each item of the first and second array respectively. The key type should be a primitive type as matching is based on SameValueZero equality.

- `getResultItem` - a function to create a result item from two matching items of the given arrays. In case of `leftJoin` the second argument for each non-matching item from the right array will be `undefined`, in case of `fullJoin` both arguments will be undefined in case items from the left or the right array do not match.

All parameters are required. In a non-TypeScript environment a runtime error will occur when some parameters are skipped.

## Examples

```js
import { join, leftJoin, fullJoin } from "array-join";

const people = [
  { id: 1, name: "Bob" },
  { id: 2, name: "Mary" },
  { id: 3, name: "Alice" },
];

const addresses = [
  { personId: 1, address: { city: "New York", country: "US" } },
  { personId: 2, address: { city: "Toronto", country: "Canada" } },
  { personId: 4, address: { city: "London", country: "UK" } },
];

console.log(
  join(
    people,
    addresses,
    (left) => left.id,
    (right) => right.personId,
    (left, right) => ({ ...left, ...right })
  )
);
```

will output

```sh
[
  {
    id: 1,
    name: 'Bob',
    personId: 1,
    address: { city: 'New York', country: 'US' }
  },
  {
    id: 2,
    name: 'Mary',
    personId: 2,
    address: { city: 'Toronto', country: 'Canada' }
  }
]
```

### leftJoin

```js
console.log(
  leftJoin(
    people,
    addresses,
    (left) => left.id,
    (right) => right.personId,
    (left, right) => ({ ...left, ...right })
  )
);
```

will also include non-matching items from the left array

```sh
[
  {
    left: { id: 1, name: 'Bob' },
    right: { personId: 1, address: { city: 'New York', country: 'US' } }
  },
  {
    left: { id: 2, name: 'Mary' },
    right: { personId: 2, address: { city: 'Toronto', country: 'Canada' } }
  },
  {
    left: { id: 3, name: 'Alice' },
    right: undefined
  }
]
```

### fullJoin

```js
console.log(
  fullJoin(
    people,
    addresses,
    (left) => left.id,
    (right) => right.personId,
    (left, right) => ({ ...left, ...right })
  )
);
```

will include non-matching items from both arrays

```sh
[
  {
    left: { id: 1, name: 'Bob' },
    right: { personId: 1, address: { city: 'New York', country: 'US' } }
  },
  {
    left: { id: 2, name: 'Mary' },
    right: { personId: 2, address: { city: 'Toronto', country: 'Canada' } }
  },
  {
    left: { id: 3, name: 'Alice' },
    right: undefined
  }
  {
    left: undefined,
    right:{ personId: 4, address: { city: 'London', country: 'UK' } }
  }
]
```

## Breaking changes in version 3

- re-written on TypeScript (which ensures typings to be correct)

- simplefied interface with all required parameters

- accept an arbitrary function to create a result item

- deprecated matching items by a custom function for the sake of performance improvement (up to 10x)
