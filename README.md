# array-join
Join arrays by common key or with custom matching function.

[![build status](https://img.shields.io/travis/iredchuk/array-join/master.svg?style=flat-square)](https://travis-ci.org/iredchuk/array-join)

## join(array1, array2, options)
### with common key:
~~~js
const { join } = require('array-join');

join([
		{ id: 1, name: 'apple' },
		{ id: 2, name: 'banana' },
		{ id: 3, name: 'orange' }
	],
	[
		{ id: 1, color: 'red' },
		{ id: 2, color: 'yellow' }
		{ id: 4, color: 'blue' }
	],
	{ key: 'id' });

// result:
[
	{ id: 1, name: 'apple', color: 'red' },
	{ id: 2, name: 'banana', color: 'yellow' }
]
~~~

### with different matching keys:
~~~js
join([
		{ id: 1, name: 'apple' },
		{ id: 2, name: 'banana' },
		{ id: 3, name: 'orange' }
	],
	[
		{ num: 1, color: 'red' },
		{ num: 2, color: 'yellow' }
		{ num: 4, color: 'blue' }
	],
	{ key1: 'id', key2: 'num' });

// result:
[
	{ id: 1, name: 'apple', color: 'red' },
	{ id: 2, name: 'banana', color: 'yellow' }
]
~~~

### with custom matching function:
~~~js
join([
		{ a: 10, b: 2 },
		{ a: 100, b: 3 },
		{ a: 1000, b: 4 }
	],
	[
		{ p: 20, text: 'wow' },
		{ p: 4000, text: 'cool' }
	],
	{ match: (x, y) => x.a * x.b === y.p });

// result:
[
	{ a: 10, b: 2, p: 20, text: 'wow' },
	{ a: 1000, b: 4, p: 4000, text: 'cool' }
]
~~~

### object keys can be prefixed to avoid possible collisions:
~~~js
join([
		{ id: 1, name: 'apple' },
		{ id: 2, name: 'banana' },
		{ id: 3, name: 'orange' }
	],
	[
		{ id: 2, name: 'Venus' },
		{ id: 3, name: 'Mars' },
		{ id: 4, name: 'Jupiter' }
	],
	{ key1: 'id', key2: 'num', prefix1: 'left_', prefix2: 'right_' });

// result:
[
	{ left_id: 2, right_id: 2, left_name: 'banana', right_name: 'Venus' },
	{ left_id: 3, right_id: 2, left_name: 'orange', right_name: 'Mars' }
]
~~~

## leftJoin(array1, array2, options)
~~~js
const { leftJoin } = require('array-join');

leftJoin([
		{ id: 1, name: 'apple' },
		{ id: 2, name: 'banana' },
		{ id: 3, name: 'orange' },
		{ id: 4, name: 'apricot' }
	],
	[
		{ id: 1, color: 'red' },
		{ id: 2, color: 'yellow' }
		{ id: 5, color: 'blue' }
	],
	{ key: 'id' });

// result:
[
	{ id: 1, name: 'apple', color: 'red' },
	{ id: 2, name: 'banana', color: 'yellow' },
	// leftJoin adds all items from the left array,
	// no matter if they match or not:
	{ id: 3, name: 'orange' },
	{ id: 4, name: 'apricot' }
]
~~~

### All options applicable to `join` work also for `leftJoin`.
