import { expectType } from "tsd";
import { join, leftJoin, fullJoin, Options } from ".";

const array1 = [{ a: 1, b: 2 }];
const array2 = [{ a: 2, c: 3 }];

type JoinFn = (
  array1: object[],
  array2: object[],
  options?: Options
) => object[];

function testTypes(joinFn: JoinFn) {
  expectType<object[]>(joinFn(array1, array2));

  expectType<object[]>(joinFn(array1, array2, { key: "a" }));

  expectType<object[]>(joinFn(array1, array2, { key1: "b", key2: "c" }));

  expectType<object[]>(
    joinFn(array1, array2, {
      key: "a",
      propMap1: (s: string) => s + "1",
      propMap2: (s: string) => s + "2",
    })
  );

  expectType<object[]>(
    joinFn(array1, array2, {
      key: "a",
      match: (left: { a: any }, right: { a: any }) => left["a"] === right["a"],
    })
  );

  expectType<object[]>(
    joinFn(array1, array2, {
      key: "a",
      leftAs: "left",
      rightAs: "right",
    })
  );
}

testTypes(join);
testTypes(leftJoin);
testTypes(fullJoin);
