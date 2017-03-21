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
