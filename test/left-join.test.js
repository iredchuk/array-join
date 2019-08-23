const { leftJoin } = require("../src");

test("left join two arrays with the same key", () => {
  const array1 = [
    { id: 1, str: "one" },
    { id: 2, str: "two" },
    { id: 3, str: "three" }
  ];

  const array2 = [
    { id: 2, bool: true },
    { id: 3, bool: false },
    { id: 4, bool: undefined }
  ];

  const actual = leftJoin(array1, array2, { key: "id" });

  const expected = [
    { id: 1, str: "one" },
    { id: 2, str: "two", bool: true },
    { id: 3, str: "three", bool: false }
  ];

  expect(actual).toEqual(expected);
});

test("left join two arrays with different keys", () => {
  const array1 = [
    { id: 1, str: "one" },
    { id: 2, str: "two" },
    { id: 3, str: "three" }
  ];

  const array2 = [{ key: 1, bool: true }, { key: 3, bool: false }];

  const actual = leftJoin(array1, array2, { key1: "id", key2: "key" });

  const expected = [
    { id: 1, key: 1, str: "one", bool: true },
    { id: 2, str: "two" },
    { id: 3, key: 3, str: "three", bool: false }
  ];

  expect(actual).toEqual(expected);
});

test("left join two arrays with compare function", () => {
  const array1 = [
    { x: 1, y: 2, str: "0 (mod 3)" },
    { x: 3, y: 1, str: "1 (mod 3)" },
    { x: 2, y: 6, str: "2 (mod 3)" }
  ];

  const array2 = [{ z: 0, num: 300 }, { z: 1, num: 301 }];

  const actual = leftJoin(array1, array2, {
    match: (a1, a2) => (a1.x + a1.y) % 3 === a2.z
  });

  const expected = [
    { x: 1, y: 2, z: 0, str: "0 (mod 3)", num: 300 },
    { x: 3, y: 1, z: 1, str: "1 (mod 3)", num: 301 },
    { x: 2, y: 6, str: "2 (mod 3)" }
  ];

  expect(actual).toEqual(expected);
});

test("left join two arrays when keys are not unique", () => {
  const array1 = [
    { key: true, str: "True 1" },
    { key: false, str: "False 1" },
    { key: true, str: "True 2" }
  ];

  const array2 = [
    { key: null, num: 0 },
    { key: true, num: 1 },
    { key: true, num: 2 }
  ];

  const actual = leftJoin(array1, array2, { key: "key" });

  const expected = [
    { key: true, str: "True 1", num: 1 },
    { key: true, str: "True 1", num: 2 },
    { key: false, str: "False 1" },
    { key: true, str: "True 2", num: 1 },
    { key: true, str: "True 2", num: 2 }
  ];

  expect(actual).toEqual(expected);
});

test("left join two arrays when some keys are missing", () => {
  const array1 = [
    { id: 1, str: "one" },
    { id: 2, str: "two" },
    { str: "unknown" }
  ];

  const array2 = [
    { id: 1, bool: false },
    { id: 2, bool: true },
    { foo: "bar" }
  ];

  const actual = leftJoin(array1, array2, { key: "id" });

  const expected = [
    { id: 1, str: "one", bool: false },
    { id: 2, str: "two", bool: true },
    { str: "unknown" }
  ];

  expect(actual).toEqual(expected);
});

test("left join: when some properties are the same, assign values from the first array", () => {
  const array1 = [
    { id: 1, str: "ONE" },
    { id: 2, str: "TWO" },
    { id: 3, str: "THREE" }
  ];

  const array2 = [
    { id: 1, str: "one" },
    { id: 2, str: "two" },
    { id: 3, str: "three" }
  ];

  const actual = leftJoin(array1, array2, { key: "id" });

  const expected = [
    { id: 1, str: "ONE" },
    { id: 2, str: "TWO" },
    { id: 3, str: "THREE" }
  ];

  expect(actual).toEqual(expected);
});

test("left join: when all keys are set, specific keys have preference", () => {
  const array1 = [{ id: 1, n: 200 }, { id: 2, n: 300 }, { id: 3, n: 400 }];

  const array2 = [{ id: 1, m: 300 }, { id: 2, m: 250 }, { id: 3, m: 200 }];

  const actual = leftJoin(array1, array2, { key: "id", key1: "n", key2: "m" });

  const expected = [
    { id: 1, n: 200, m: 200 },
    { id: 2, n: 300, m: 300 },
    { id: 3, n: 400 }
  ];

  expect(actual).toEqual(expected);
});

test("left join: when first array is not an Array, return empty array", () => {
  const array = [{ id: 1 }, { id: 2 }];

  const actual = leftJoin({}, array, { key: "id" });

  expect(actual).toEqual([]);
});

test("left join: when second array is not an Array, return first array", () => {
  const array = [{ id: 1 }, { id: 2 }];

  const actual = leftJoin(array, undefined, { key: "id" });

  const expected = [{ id: 1 }, { id: 2 }];

  expect(actual).toEqual(expected);
});

test("left join: when both arrays are empty, return empty array", () => {
  const actual = leftJoin([], [], { key: "id" });

  expect(actual).toEqual([]);
});

test("left join: when first array is empty, return empty array", () => {
  const array = [{ id: 1 }, { id: 2 }];

  const actual = leftJoin([], array, { key: "id" });

  expect(actual).toEqual([]);
});

test("left join: when second array is empty, return first array", () => {
  const array = [{ id: 1 }, { id: 2 }];

  const actual = leftJoin(array, [], { key: "id" });

  const expected = [{ id: 1 }, { id: 2 }];

  expect(actual).toEqual(expected);
});

test("left join two arrays with property mappers", () => {
  const array1 = [
    { id: 1, str: "left 1" },
    { id: 2, str: "left 2" },
    { id: 3, str: "left 3" }
  ];

  const array2 = [
    { id: 2, str: "right 2" },
    { id: 3, str: "right 3" },
    { id: 4, str: "right 4" }
  ];

  const actual = leftJoin(array1, array2, {
    key: "id",
    propMap1: p => "l" + p,
    propMap2: p => "r" + p
  });

  const expected = [
    { lid: 1, lstr: "left 1" },
    { lid: 2, lstr: "left 2", rid: 2, rstr: "right 2" },
    { lid: 3, lstr: "left 3", rid: 3, rstr: "right 3" }
  ];

  expect(actual).toEqual(expected);
});

test("left join two arrays with property mappers and custom matching function", () => {
  const array1 = [
    { id: 1, str: "left 1" },
    { id: 2, str: "left 2" },
    { id: 3, str: "left 3" }
  ];

  const array2 = [
    { id: 12, str: "right 2" },
    { id: 13, str: "right 3" },
    { id: 14, str: "right 4" }
  ];

  const actual = leftJoin(array1, array2, {
    match: (a1, a2) => a2.id - a1.id === 10,
    propMap1: p => "l" + p,
    propMap2: p => "r" + p
  });

  const expected = [
    { lid: 1, lstr: "left 1" },
    { lid: 2, lstr: "left 2", rid: 12, rstr: "right 2" },
    { lid: 3, lstr: "left 3", rid: 13, rstr: "right 3" }
  ];

  expect(actual).toEqual(expected);
});

test("left join when no key is specified returns empty array", () => {
  const array1 = [{ id: 1, str: "one" }, { id: 2, str: "two" }];

  const array2 = [{ id: 1, bool: true }, { id: 2, bool: false }];

  const actual = leftJoin(array1, array2, {});

  expect(actual).toEqual([]);
});

test("left join when options are not passed returns empty array", () => {
  const array1 = [{ id: 1, str: "one" }, { id: 2, str: "two" }];

  const array2 = [{ id: 1, bool: true }, { id: 2, bool: false }];

  const actual = leftJoin(array1, array2);

  expect(actual).toEqual([]);
});

test("left join when rightAs option is passed", () => {
  const array1 = [
    { id: 0, str: "zero" },
    { id: 1, str: "one" },
    { id: 2, str: "two" }
  ];

  const array2 = [{ id: 1, bool: true }, { id: 2, bool: false }];

  const actual = leftJoin(array1, array2, { key: "id", rightAs: "right" });

  const expected = [
    { id: 0, str: "zero" },
    { id: 1, str: "one", right: { id: 1, bool: true } },
    { id: 2, str: "two", right: { id: 2, bool: false } }
  ];

  expect(actual).toEqual(expected);
});

test("left join when leftAs option is passed", () => {
  const array1 = [
    { id: 0, str: "zero" },
    { id: 1, str: "one" },
    { id: 2, str: "two" }
  ];

  const array2 = [{ id: 1, bool: true }, { id: 2, bool: false }];

  const actual = leftJoin(array1, array2, { key: "id", leftAs: "left" });

  const expected = [
    { left: { id: 0, str: "zero" } },
    { left: { id: 1, str: "one" }, id: 1, bool: true },
    { left: { id: 2, str: "two" }, id: 2, bool: false }
  ];

  expect(actual).toEqual(expected);
});

test("left join when both leftAs and rightAs options are passed", () => {
  const array1 = [
    { id: 0, str: "zero" },
    { id: 1, str: "one" },
    { id: 2, str: "two" }
  ];

  const array2 = [{ id: 1, bool: true }, { id: 2, bool: false }];

  const actual = leftJoin(array1, array2, {
    key: "id",
    leftAs: "left",
    rightAs: "right"
  });

  const expected = [
    { left: { id: 0, str: "zero" } },
    { left: { id: 1, str: "one" }, right: { id: 1, bool: true } },
    { left: { id: 2, str: "two" }, right: { id: 2, bool: false } }
  ];

  expect(actual).toEqual(expected);
});

test("left join when both leftAs, rightAs and propMap options are passed", () => {
  const array1 = [
    { id: 0, str: "zero" },
    { id: 1, str: "one" },
    { id: 2, str: "two" }
  ];

  const array2 = [{ id: 1, str: "1" }, { id: 2, str: "2" }];

  const actual = leftJoin(array1, array2, {
    key: "id",
    leftAs: "left",
    rightAs: "right",
    propMap1: p => `${p}_1`,
    propMap2: p => `${p}_2`
  });

  const expected = [
    { left: { id_1: 0, str_1: "zero" } },
    { left: { id_1: 1, str_1: "one" }, right: { id_2: 1, str_2: "1" } },
    { left: { id_1: 2, str_1: "two" }, right: { id_2: 2, str_2: "2" } }
  ];

  expect(actual).toEqual(expected);
});
