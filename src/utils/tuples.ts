import { HKT, $ } from '@kinds';

export type Tuple<T, N extends number, $acc extends unknown[] = []> = $acc['length'] extends N
  ? $acc
  : Tuple<T, N, [...$acc, T]>;

export type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : [];

export type SplitAt<N extends number, T extends unknown[], $acc extends unknown[] = []> = $acc['length'] extends N
  ? [$acc, T]
  : T extends [infer H, ...infer R]
    ? SplitAt<N, R, [...$acc, H]>
    : [$acc, []];

type MapImpl<T, Fn extends HKT> = {
  [K in keyof T]: $<Fn, [T[K]]>;
};

export interface Map<Fn extends HKT> extends HKT {
  return: MapImpl<this['rawArgs'], Fn>;
}
