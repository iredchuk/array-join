const createMap = <TItem, TKey>(
  array: TItem[],
  getKey: (a: TItem) => TKey
): Map<TKey, TItem[]> => {
  const map = new Map<TKey, TItem[]>();

  for (const item of array) {
    const value = getKey(item);
    if (map.has(value)) {
      const items = map.get(value);
      items!.push(item);
      map.set(value, items!);
    } else {
      map.set(value, [item]);
    }
  }

  return map;
};

const joinIntern = <TLeft, TRight, TKey, TResult>(
  leftArray: TLeft[],
  rightArray: TRight[],
  getLeftKey: (l: TLeft) => TKey,
  getRightKey: (r: TRight) => TKey,
  getResultItem: (l: TLeft | undefined, e: TRight | undefined) => TResult,
  alwaysIncludeLeftItems: boolean,
  alwaysIncludeRightItems: boolean
): TResult[] => {
  if (!alwaysIncludeRightItems && leftArray.length === 0) {
    return [];
  }
  if (!alwaysIncludeLeftItems && rightArray.length === 0) {
    return [];
  }

  const leftMap = createMap(leftArray, getLeftKey);
  const rightMap = createMap(rightArray, getRightKey);

  const result: TResult[] = [];

  for (const key of leftMap.keys()) {
    if (rightMap.has(key)) {
      const leftItems = leftMap.get(key);
      const rightItems = rightMap.get(key);
      leftItems!.forEach((leftItem) =>
        rightItems!.forEach((rightItem) =>
          result.push(getResultItem(leftItem, rightItem))
        )
      );
    } else if (alwaysIncludeLeftItems) {
      const leftItems = leftMap.get(key);
      leftItems!.forEach((leftItem) =>
        result.push(getResultItem(leftItem, undefined))
      );
    }
  }

  if (alwaysIncludeRightItems) {
    for (const key of rightMap.keys()) {
      if (!leftMap.has(key)) {
        const rightItems = rightMap.get(key);
        rightItems!.forEach((rightItem) =>
          result.push(getResultItem(undefined, rightItem))
        );
      }
    }
  }

  return result;
};

export const join = <TLeft, TRight, TKey, TResult>(
  leftArray: TLeft[],
  rightArray: TRight[],
  getLeftKey: (l: TLeft) => TKey,
  getRightKey: (r: TRight) => TKey,
  getResultItem: (l: TLeft, e: TRight) => TResult
): TResult[] =>
  joinIntern(
    leftArray,
    rightArray,
    getLeftKey,
    getRightKey,
    (l, r) => getResultItem(l!, r!),
    false,
    false
  );

export const leftJoin = <TLeft, TRight, TKey, TResult>(
  leftArray: TLeft[],
  rightArray: TRight[],
  getLeftKey: (l: TLeft) => TKey,
  getRightKey: (r: TRight) => TKey,
  getResultItem: (l: TLeft, e: TRight | undefined) => TResult
): TResult[] =>
  joinIntern(
    leftArray,
    rightArray,
    getLeftKey,
    getRightKey,
    (l, r) => getResultItem(l!, r),
    true,
    false
  );

export const fullJoin = <TLeft, TRight, TKey, TResult>(
  leftArray: TLeft[],
  rightArray: TRight[],
  getLeftKey: (l: TLeft) => TKey,
  getRightKey: (r: TRight) => TKey,
  getResultItem: (l: TLeft | undefined, e: TRight | undefined) => TResult
): TResult[] =>
  joinIntern(
    leftArray,
    rightArray,
    getLeftKey,
    getRightKey,
    (l, r) => getResultItem(l, r),
    true,
    true
  );
