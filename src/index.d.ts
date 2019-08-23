export type MatchFn = (a: object, b: object) => boolean;
export type PropMapFn = (a: string) => string;

export interface Options {
  key?: string;
  key1?: string;
  key2?: string;
  propMap1?: PropMapFn;
  propMap2?: PropMapFn;
  leftAs?: string;
  rightAs?: string;
  match?: MatchFn;
}

export function join(
  array1: object[],
  array2: object[],
  options: Options
): object[];

export function leftJoin(
  array1: object[],
  array2: object[],
  options: Options
): object[];

export function fullJoin(
  array1: object[],
  array2: object[],
  options: Options
): object[];
