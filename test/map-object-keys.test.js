import test from 'ava'
import mapObjectKeys from '../src/map-object-keys'

test('when object has keys and mapper is a function, return object with mapped first-level keys', t => {
  const actual = mapObjectKeys({
    id: 1,
    name: 'foo',
    array: {
      value: [1, 2, 3]
    }
  }, key => 'prefix' + key)

  t.deepEqual(actual, {
    prefixid: 1,
    prefixname: 'foo',
    prefixarray: {
      value: [1, 2, 3]
    }
  })
})

test('when object has keys and prefix is undefined, return the same object', t => {
  const actual = mapObjectKeys({ id: 1 })
  t.deepEqual(actual, { id: 1 })
})

test('when object is undefined, return undefined', t => {
  const actual = mapObjectKeys(undefined, 'prefix')
  t.is(actual, undefined)
})

test('when object is null, return null', t => {
  const actual = mapObjectKeys(null, 'prefix')
  t.is(actual, null)
})

test('when object is a string, return this string', t => {
  const actual = mapObjectKeys('foo', 'prefix')
  t.is(actual, 'foo')
})

test('when object is a number, return this number', t => {
  const actual = mapObjectKeys(17, 'prefix')
  t.is(actual, 17)
})

test('when object is an empty object, return empty object', t => {
  const actual = mapObjectKeys({}, 'prefix')
  t.deepEqual(actual, {})
})
