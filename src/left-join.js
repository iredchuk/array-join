const options = require("./options");
const mapObjectKeys = require("./map-object-keys");

function leftJoin(
  array1,
  array2,
  { key, key1, key2, match, propMap1, propMap2, leftAs, rightAs } = {}
) {
  if (!Array.isArray(array1)) {
    return [];
  }

  if (!Array.isArray(array2)) {
    return array1.map((a) => a);
  }

  const matchItems = options.getMatchFunction({ key, key1, key2, match });

  if (typeof matchItems !== "function") {
    return [];
  }

  return array1.reduce((prev, cur) => {
    const matches = array2.filter((a2) => matchItems(cur, a2));

    return matches.length === 0
      ? prev.concat(
          leftAs
            ? { [leftAs]: mapObjectKeys(cur, propMap1) }
            : mapObjectKeys(cur, propMap1)
        )
      : prev.concat(
          matches.map((m) =>
            Object.assign(
              {},
              rightAs
                ? { [rightAs]: mapObjectKeys(m, propMap2) }
                : mapObjectKeys(m, propMap2),
              leftAs
                ? { [leftAs]: mapObjectKeys(cur, propMap1) }
                : mapObjectKeys(cur, propMap1)
            )
          )
        );
  }, []);
}

module.exports = leftJoin;
