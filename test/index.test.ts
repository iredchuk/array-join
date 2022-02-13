import { fullJoin, join, leftJoin } from "../src/index";

interface LeftItem {
  id: number;
  str?: string | null;
}

interface RightItem {
  id: number;
  desc?: string | null;
  bool: boolean;
}

describe("join", () => {
  test("with numeric key", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "one" },
      { id: 2, str: "two" },
      { id: 3, str: "three" },
    ];

    const array2: RightItem[] = [
      { id: 2, bool: true },
      { id: 3, bool: false },
    ];

    const actual = join(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 2, str: "two", bool: true },
      { id: 3, str: "three", bool: false },
    ]);
  });

  test("with string key", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "one" },
      { id: 2, str: "two" },
      { id: 3, str: "three" },
    ];

    const array2: RightItem[] = [
      { id: 2, bool: true, desc: "two" },
      { id: 3, bool: false, desc: "three" },
    ];

    const actual = join(
      array1,
      array2,
      (l) => l.str,
      (r) => r.desc,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 2, str: "two", bool: true, desc: "two" },
      { id: 3, str: "three", bool: false, desc: "three" },
    ]);
  });

  test("when keys are not unique", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "1" },
      { id: 2, str: "2" },
      { id: 3, str: "3" },
      { id: 1, str: "1.2" },
    ];

    const array2: RightItem[] = [
      { id: 4, bool: true },
      { id: 2, bool: true },
      { id: 1, bool: false },
      { id: 1, bool: false, desc: "Second false" },
    ];

    const actual = join(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, str: "1", bool: false },
      { id: 1, str: "1", bool: false, desc: "Second false" },
      { id: 1, str: "1.2", bool: false },
      { id: 1, str: "1.2", bool: false, desc: "Second false" },
      { id: 2, str: "2", bool: true },
    ]);
  });

  test("when some keys are null or undefined", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "1" },
      { id: 2, str: "2" },
      { id: 3, str: null },
      { id: 2 },
    ];

    const array2: RightItem[] = [
      { id: 2, bool: true },
      { id: 1, bool: false, desc: "1" },
      { id: 3, bool: false, desc: null },
      { id: 2, bool: false, desc: undefined },
    ];

    const actual = join(
      array1,
      array2,
      (l) => l.str,
      (r) => r.desc,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, str: "1", bool: false, desc: "1" },
      { id: 3, str: null, bool: false, desc: null },
      { id: 2, bool: true },
      { id: 2, bool: false, desc: undefined },
    ]);
  });

  test("with some undefined items", () => {
    const array1: (LeftItem | undefined)[] = [
      { id: 1, str: "one" },
      undefined,
      { id: 2, str: "two" },
      undefined,
      { id: 3, str: "three" },
    ];

    const array2: (RightItem | undefined)[] = [
      { id: 2, bool: true },
      undefined,
      undefined,
    ];

    const actual = join(
      array1,
      array2,
      (l) => l?.id ?? -1,
      (r) => r?.id ?? -2,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([{ id: 2, str: "two", bool: true }]);
  });

  test("when both arrays are empty, return empty array", () => {
    const array1: LeftItem[] = [];

    const array2: RightItem[] = [];

    const actual = join(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([]);
  });

  test("when first array is empty, return empty array", () => {
    const array1: LeftItem[] = [];

    const array2: RightItem[] = [
      { id: 1, bool: false },
      { id: 2, bool: true },
    ];

    const actual = join(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([]);
  });

  test("when second array is empty, return empty array", () => {
    const array1: LeftItem[] = [{ id: 1, str: "one" }];

    const array2: RightItem[] = [];

    const actual = join(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([]);
  });

  test("NaN keys match", () => {
    const array1: LeftItem[] = [
      { id: NaN, str: "???" },
      { id: NaN, str: "..." },
    ];

    const array2: RightItem[] = [{ id: NaN, bool: false }];

    const actual = join(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: NaN, str: "???", bool: false },
      { id: NaN, str: "...", bool: false },
    ]);
  });
});

describe("leftJoin", () => {
  test("with numeric key", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "one" },
      { id: 2, str: "two" },
      { id: 3, str: "three" },
    ];

    const array2: RightItem[] = [
      { id: 2, bool: true },
      { id: 3, bool: false },
    ];

    const actual = leftJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, str: "one" },
      { id: 2, str: "two", bool: true },
      { id: 3, str: "three", bool: false },
    ]);
  });

  test("when keys are not unique", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "1" },
      { id: 2, str: "2" },
      { id: 3, str: "3" },
      { id: 1, str: "1.2" },
      { id: 3, str: "3.1" },
    ];

    const array2: RightItem[] = [
      { id: 4, bool: true },
      { id: 2, bool: true },
      { id: 1, bool: false },
      { id: 1, bool: false, desc: "Second false" },
    ];

    const actual = leftJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, str: "1", bool: false },
      { id: 1, str: "1", bool: false, desc: "Second false" },
      { id: 1, str: "1.2", bool: false },
      { id: 1, str: "1.2", bool: false, desc: "Second false" },
      { id: 2, str: "2", bool: true },
      { id: 3, str: "3" },
      { id: 3, str: "3.1" },
    ]);
  });

  test("when some keys are null or undefined", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "1" },
      { id: 2, str: "2" },
      { id: 3, str: null },
      { id: 4, str: "" },
    ];

    const array2: RightItem[] = [
      { id: 2, bool: true },
      { id: 3, bool: false, desc: null },
      { id: 4, bool: true, desc: "" },
    ];

    const actual = leftJoin(
      array1,
      array2,
      (l) => l.str,
      (r) => r.desc,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, str: "1" },
      { id: 2, str: "2" },
      { id: 3, str: null, bool: false, desc: null },
      { id: 4, str: "", bool: true, desc: "" },
    ]);
  });

  test("when both arrays are empty, return empty array", () => {
    const array1: LeftItem[] = [];

    const array2: RightItem[] = [];

    const actual = leftJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([]);
  });

  test("when first array is empty, return empty array", () => {
    const array1: LeftItem[] = [];

    const array2: RightItem[] = [
      { id: 1, bool: false },
      { id: 2, bool: true },
    ];

    const actual = leftJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([]);
  });

  test("when second array is empty, return all items from first array", () => {
    const array1: LeftItem[] = [{ id: 1, str: "one" }, { id: 2 }];

    const array2: RightItem[] = [];

    const actual = leftJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([{ id: 1, str: "one" }, { id: 2 }]);
  });
});

describe("fullJoin", () => {
  test("with numeric key", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "one" },
      { id: 2, str: "two" },
      { id: 3, str: "three" },
    ];

    const array2: RightItem[] = [
      { id: 2, bool: true },
      { id: 3, bool: false },
      { id: 4, bool: true, desc: "Four" },
    ];

    const actual = fullJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, str: "one" },
      { id: 2, str: "two", bool: true },
      { id: 3, str: "three", bool: false },
      { id: 4, bool: true, desc: "Four" },
    ]);
  });

  test("when keys are not unique", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "1" },
      { id: 2, str: "2" },
      { id: 3, str: "3" },
      { id: 1, str: "1.2" },
      { id: 3, str: "3.1" },
    ];

    const array2: RightItem[] = [
      { id: 4, bool: true },
      { id: 2, bool: true },
      { id: 1, bool: false },
      { id: 1, bool: false, desc: "Second false" },
    ];

    const actual = fullJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, str: "1", bool: false },
      { id: 1, str: "1", bool: false, desc: "Second false" },
      { id: 1, str: "1.2", bool: false },
      { id: 1, str: "1.2", bool: false, desc: "Second false" },
      { id: 2, str: "2", bool: true },
      { id: 3, str: "3" },
      { id: 3, str: "3.1" },
      { id: 4, bool: true },
    ]);
  });

  test("when some keys are null or undefined", () => {
    const array1: LeftItem[] = [
      { id: 1, str: "1" },
      { id: 2, str: "2" },
      { id: 3, str: null },
      { id: 4, str: "" },
    ];

    const array2: RightItem[] = [
      { id: 2, bool: true },
      { id: 3, bool: false, desc: null },
      { id: 4, bool: true, desc: "" },
    ];

    const actual = fullJoin(
      array1,
      array2,
      (l) => l.str,
      (r) => r.desc,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, str: "1" },
      { id: 2, str: "2" },
      { id: 3, str: null, bool: false, desc: null },
      { id: 4, str: "", bool: true, desc: "" },
      { id: 2, bool: true },
    ]);
  });

  test("when both arrays are empty, return empty array", () => {
    const array1: LeftItem[] = [];

    const array2: RightItem[] = [];

    const actual = fullJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([]);
  });

  test("when first array is empty, return all items from second array", () => {
    const array1: LeftItem[] = [];

    const array2: RightItem[] = [
      { id: 1, bool: false },
      { id: 2, bool: true },
    ];

    const actual = fullJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([
      { id: 1, bool: false },
      { id: 2, bool: true },
    ]);
  });

  test("when second array is empty, return all items from first array", () => {
    const array1: LeftItem[] = [{ id: 1, str: "one" }, { id: 2 }];

    const array2: RightItem[] = [];

    const actual = leftJoin(
      array1,
      array2,
      (l) => l.id,
      (r) => r.id,
      (l, r) => ({ ...l, ...r })
    );

    expect(actual).toEqual([{ id: 1, str: "one" }, { id: 2 }]);
  });
});
