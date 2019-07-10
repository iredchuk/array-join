export type MatchFn = (a: object, b: object) => boolean;

export interface Options {
  key?: string;
  key1?: string;
  key2?: string;
  propMap1?: (prop: string) => string;
  propMap2?: (prop: string) => string;
  match?: MatchFn;
  as?: string;
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
