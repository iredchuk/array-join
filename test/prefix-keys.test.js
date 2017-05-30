import test from 'ava';
import prefixKeys from '../src/prefix-keys';

test('when object has keys and prefix is non-empty, return object with prefixed first-level keys', t => {
	const actual = prefixKeys({
		id: 1,
		name: 'foo',
		array: {
			value: [1, 2, 3]
		}
	}, 'prefix');

	t.deepEqual(actual, {
		prefixid: 1,
		prefixname: 'foo',
		prefixarray: {
			value: [1, 2, 3]
		}
	});
});

test('when object has keys and prefix is empty, return same object', t => {
	const actual = prefixKeys({id: 1}, '');
	t.deepEqual(actual, {id: 1});
});

test('when object is undefined, return undefined', t => {
	const actual = prefixKeys(undefined, 'prefix');
	t.is(actual, undefined);
});

test('when object is null, return null', t => {
	const actual = prefixKeys(null, 'prefix');
	t.is(actual, null);
});

test('when object is a string, return this string', t => {
	const actual = prefixKeys('foo', 'prefix');
	t.is(actual, 'foo');
});

test('when object is a number, return this number', t => {
	const actual = prefixKeys(17, 'prefix');
	t.is(actual, 17);
});

test('when object is an empty object, return empty object', t => {
	const actual = prefixKeys({}, 'prefix');
	t.deepEqual(actual, {});
});
