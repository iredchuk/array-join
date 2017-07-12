const test = require('tape')
const leftJoin = require('../dist/bundle').leftJoin

test('join two arrays with the same key', t => {
  t.plan(1)

  const array1 = [
    { id: 1, str: 'one' },
    { id: 2, str: 'two' },
    { id: 3, str: 'three' }
  ]

  const array2 = [
    { id: 2, bool: true },
    { id: 3, bool: false },
    { id: 4, bool: undefined }
  ]

  const actual = leftJoin(array1, array2, { key: 'id' })

  const expected = [
    { id: 1, str: 'one' },
    { id: 2, str: 'two', bool: true },
    { id: 3, str: 'three', bool: false }
  ]

  t.deepEqual(actual, expected)
})

test('join two arrays with different keys', t => {
  t.plan(1)

  const array1 = [
    { id: 1, str: 'one' },
    { id: 2, str: 'two' },
    { id: 3, str: 'three' }
  ]

  const array2 = [
    { key: 1, bool: true },
    { key: 3, bool: false }
  ]

  const actual = leftJoin(array1, array2, { key1: 'id', key2: 'key' })

  const expected = [
    { id: 1, key: 1, str: 'one', bool: true },
    { id: 2, str: 'two' },
    { id: 3, key: 3, str: 'three', bool: false }
  ]

  t.deepEqual(actual, expected)
})

test('join two arrays with compare function', t => {
  t.plan(1)

  const array1 = [
    { x: 1, y: 2, str: '0 (mod 3)' },
    { x: 3, y: 1, str: '1 (mod 3)' },
    { x: 2, y: 6, str: '2 (mod 3)' }
  ]

  const array2 = [
    { z: 0, num: 300 },
    { z: 1, num: 301 }
  ]

  const actual = leftJoin(array1, array2, {
    match: (a1, a2) => (a1.x + a1.y) % 3 === a2.z
  })

  const expected = [
    { x: 1, y: 2, z: 0, str: '0 (mod 3)', num: 300 },
    { x: 3, y: 1, z: 1, str: '1 (mod 3)', num: 301 },
    { x: 2, y: 6, str: '2 (mod 3)' }
  ]

  t.deepEqual(actual, expected)
})

test('join two arrays when keys are not unique', t => {
  t.plan(1)

  const array1 = [
    { key: true, str: 'True 1' },
    { key: false, str: 'False 1' },
    { key: true, str: 'True 2' }
  ]

  const array2 = [
    { key: null, num: 0 },
    { key: true, num: 1 },
    { key: true, num: 2 }
  ]

  const actual = leftJoin(array1, array2, { key: 'key' })

  const expected = [
    { key: true, str: 'True 1', num: 1 },
    { key: true, str: 'True 1', num: 2 },
    { key: false, str: 'False 1' },
    { key: true, str: 'True 2', num: 1 },
    { key: true, str: 'True 2', num: 2 }
  ]

  t.deepEqual(actual, expected)
})

test('join two arrays when some keys are missing', t => {
  t.plan(1)

  const array1 = [
    { id: 1, str: 'one' },
    { id: 2, str: 'two' },
    { str: 'unknown' }
  ]

  const array2 = [
    { id: 1, bool: false },
    { id: 2, bool: true },
    { foo: 'bar' }
  ]

  const actual = leftJoin(array1, array2, { key: 'id' })

  const expected = [
    { id: 1, str: 'one', bool: false },
    { id: 2, str: 'two', bool: true },
    { str: 'unknown' }
  ]

  t.deepEqual(actual, expected)
})

test('when some properties are the same, assign values from the first array', t => {
  t.plan(1)

  const array1 = [
    { id: 1, str: 'ONE' },
    { id: 2, str: 'TWO' },
    { id: 3, str: 'THREE' }
  ]

  const array2 = [
    { id: 1, str: 'one' },
    { id: 2, str: 'two' },
    { id: 3, str: 'three' }
  ]

  const actual = leftJoin(array1, array2, { key: 'id' })

  const expected = [
    { id: 1, str: 'ONE' },
    { id: 2, str: 'TWO' },
    { id: 3, str: 'THREE' }
  ]

  t.deepEqual(actual, expected)
})

test('when all keys are set, specific keys have preference', t => {
  t.plan(1)

  const array1 = [
    { id: 1, n: 200 },
    { id: 2, n: 300 },
    { id: 3, n: 400 }
  ]

  const array2 = [
    { id: 1, m: 300 },
    { id: 2, m: 250 },
    { id: 3, m: 200 }
  ]

  const actual = leftJoin(array1, array2, { key: 'id', key1: 'n', key2: 'm' })

  const expected = [
    { id: 1, n: 200, m: 200 },
    { id: 2, n: 300, m: 300 },
    { id: 3, n: 400 }
  ]

  t.deepEqual(actual, expected)
})

test('when first array is not an Array, return empty array', t => {
  t.plan(1)

  const array = [
    { id: 1 },
    { id: 2 }
  ]

  const actual = leftJoin({}, array, { key: 'id' })

  t.deepEqual(actual, [])
})

test('when second array is not an Array, return first array', t => {
  t.plan(1)

  const array = [
    { id: 1 },
    { id: 2 }
  ]

  const actual = leftJoin(array, undefined, { key: 'id' })

  const expected = [
    { id: 1 },
    { id: 2 }
  ]

  t.deepEqual(actual, expected)
})

test('when both arrays are empty, return empty array', t => {
  t.plan(1)

  const actual = leftJoin([], [], { key: 'id' })

  t.deepEqual(actual, [])
})

test('when first array is empty, return empty array', t => {
  t.plan(1)

  const array = [
    { id: 1 },
    { id: 2 }
  ]

  const actual = leftJoin([], array, { key: 'id' })

  t.deepEqual(actual, [])
})

test('when second array is empty, return first array', t => {
  t.plan(1)

  const array = [
    { id: 1 },
    { id: 2 }
  ]

  const actual = leftJoin(array, [], { key: 'id' })

  const expected = [
    { id: 1 },
    { id: 2 }
  ]

  t.deepEqual(actual, expected)
})

test('join two arrays with property mappers', t => {
  t.plan(1)

  const array1 = [
    { id: 1, str: 'left 1' },
    { id: 2, str: 'left 2' },
    { id: 3, str: 'left 3' }
  ]

  const array2 = [
    { id: 2, str: 'right 2' },
    { id: 3, str: 'right 3' },
    { id: 4, str: 'right 4' }
  ]

  const actual = leftJoin(array1, array2, { key: 'id', propMap1: p => 'l' + p, propMap2: p => 'r' + p })

  const expected = [
    { lid: 1, lstr: 'left 1' },
    { lid: 2, lstr: 'left 2', rid: 2, rstr: 'right 2' },
    { lid: 3, lstr: 'left 3', rid: 3, rstr: 'right 3' }
  ]

  t.deepEqual(actual, expected)
})

test('join two arrays with property mappers and custom matching function', t => {
  t.plan(1)

  const array1 = [
    { id: 1, str: 'left 1' },
    { id: 2, str: 'left 2' },
    { id: 3, str: 'left 3' }
  ]

  const array2 = [
    { id: 12, str: 'right 2' },
    { id: 13, str: 'right 3' },
    { id: 14, str: 'right 4' }
  ]

  const actual = leftJoin(array1, array2, {
    match: (a1, a2) => a2.id - a1.id === 10,
    propMap1: p => 'l' + p,
    propMap2: p => 'r' + p
  })

  const expected = [
    { lid: 1, lstr: 'left 1' },
    { lid: 2, lstr: 'left 2', rid: 12, rstr: 'right 2' },
    { lid: 3, lstr: 'left 3', rid: 13, rstr: 'right 3' }
  ]

  t.deepEqual(actual, expected)
})
