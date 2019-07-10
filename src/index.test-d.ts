import { expectType } from 'tsd-check';
import { join, leftJoin, fullJoin } from '.';

const array1 = [{ a: 1, b: 2 }];
const array2 = [{ a: 2, c: 3 }];

function testTypes(joinFn: any) {
  expectType<object[]>(joinFn(undefined, undefined, {}));

  expectType<object[]>(joinFn(array1, array2, { key: 'a' }));

  expectType<object[]>(joinFn(array1, array2, { key: 'a', as: 'k' }));

  expectType<object[]>(joinFn(array1, array2, { key1: 'b', key2: 'c' }));

  expectType<object[]>(
    joinFn(array1, array2, {
      key: 'a',
      propMap1: s => s + '1',
      propMap2: s => s + '2'
    })
  );

  expectType<object[]>(
    joinFn(array1, array2, {
      key: 'a',
      match: (left, right) => left['a'] === right['a']
    })
  );
}

testTypes(join);
testTypes(leftJoin);
testTypes(fullJoin);
