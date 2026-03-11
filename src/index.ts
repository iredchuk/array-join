const createMap = <TItem, TKey>(
  collection: Iterable<TItem>,
  getKey: (a: TItem) => TKey
): Map<TKey, TItem[]> => {
  const map = new Map<TKey, TItem[]>();
  for (const item of collection) {
    const key = getKey(item);
    const existing = map.get(key);
    if (existing) {
      existing.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
};

const joinIntern = <TLeft, TRight, TKey, TResult>(
  leftCollection: Iterable<TLeft>,
  rightCollection: Iterable<TRight>,
  getLeftKey: (l: TLeft) => TKey,
  getRightKey: (r: TRight) => TKey,
  getResultItem: (l: TLeft | undefined, r: TRight | undefined) => TResult,
  alwaysIncludeLeftItems: boolean,
  alwaysIncludeRightItems: boolean
): TResult[] => {
  const leftMap = createMap(leftCollection, getLeftKey);
  if (!alwaysIncludeRightItems && leftMap.size === 0) {
    return [];
  }

  const rightMap = createMap(rightCollection, getRightKey);
  if (!alwaysIncludeLeftItems && rightMap.size === 0) {
    return [];
  }

  const result: TResult[] = [];

  for (const [key, leftItems] of leftMap) {
    const rightItems = rightMap.get(key);
    if (rightItems) {
      for (const leftItem of leftItems) {
        for (const rightItem of rightItems) {
          result.push(getResultItem(leftItem, rightItem));
        }
      }
    } else if (alwaysIncludeLeftItems) {
      for (const leftItem of leftItems) {
        result.push(getResultItem(leftItem, undefined));
      }
    }
  }

  if (alwaysIncludeRightItems) {
    for (const [key, rightItems] of rightMap) {
      if (!leftMap.has(key)) {
        for (const rightItem of rightItems) {
          result.push(getResultItem(undefined, rightItem));
        }
      }
    }
  }

  return result;
};

export const join = <TLeft, TRight, TKey, TResult>(
  leftCollection: Iterable<TLeft>,
  rightCollection: Iterable<TRight>,
  getLeftKey: (l: TLeft) => TKey,
  getRightKey: (r: TRight) => TKey,
  getResultItem: (l: TLeft, r: TRight) => TResult
): TResult[] =>
  joinIntern(
    leftCollection,
    rightCollection,
    getLeftKey,
    getRightKey,
    (l, r) => getResultItem(l!, r!),
    false,
    false
  );

export const leftJoin = <TLeft, TRight, TKey, TResult>(
  leftCollection: Iterable<TLeft>,
  rightCollection: Iterable<TRight>,
  getLeftKey: (l: TLeft) => TKey,
  getRightKey: (r: TRight) => TKey,
  getResultItem: (l: TLeft, r: TRight | undefined) => TResult
): TResult[] =>
  joinIntern(
    leftCollection,
    rightCollection,
    getLeftKey,
    getRightKey,
    (l, r) => getResultItem(l!, r),
    true,
    false
  );

export const fullJoin = <TLeft, TRight, TKey, TResult>(
  leftCollection: Iterable<TLeft>,
  rightCollection: Iterable<TRight>,
  getLeftKey: (l: TLeft) => TKey,
  getRightKey: (r: TRight) => TKey,
  getResultItem: (l: TLeft | undefined, r: TRight | undefined) => TResult
): TResult[] =>
  joinIntern(
    leftCollection,
    rightCollection,
    getLeftKey,
    getRightKey,
    (l, r) => getResultItem(l, r),
    true,
    true
  );
