import { Kind, $ } from '@kinds';

export type Tuple<T, N extends number, $acc extends unknown[] = []> = number extends N
  ? T[]
  : $acc['length'] extends N
    ? $acc
    : Tuple<T, N, [...$acc, T]>;

export type ReadonlyTuple<T, N extends number, $acc extends readonly unknown[] = readonly []> = number extends N
  ? readonly T[]
  : $acc['length'] extends N
    ? $acc
    : ReadonlyTuple<T, N, readonly [...$acc, T]>;

export type StringToTuple<T extends string, $acc extends unknown[] = []> = T extends `${infer A}${infer B}`
  ? StringToTuple<B, [...$acc, A]>
  : $acc;

export type Range<Max extends number, $acc extends unknown[] = []> = $acc['length'] extends Max
  ? $acc
  : Range<Max, [...$acc, $acc['length']]>;

export type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : [];

export type Drop<N extends number, T extends unknown[], $droped extends unknown[] = []> = $droped['length'] extends N
  ? T
  : T extends [infer H, ...infer R]
    ? Drop<N, R, [...$droped, H]>
    : T;

export type Zip<T, U, $acc extends unknown[] = []> = T extends [infer TH, ...infer TR]
  ? U extends [infer UH, ...infer UR]
    ? Zip<TR, UR, [...$acc, [TH, UH]]>
    : $acc
  : $acc;

export type SplitAt<N extends number, T extends unknown[], $acc extends unknown[] = []> = $acc['length'] extends N
  ? [$acc, T]
  : T extends [infer H, ...infer R]
    ? SplitAt<N, R, [...$acc, H]>
    : [$acc, []];

type MapImpl<T, Fn extends Kind> = {
  [K in keyof T]: $<Fn, [T[K]]>;
};

export type Flatten<T, $acc extends unknown[] = []> = T extends [infer Head extends unknown[], ...infer Tail]
  ? Flatten<Tail, [...$acc, ...Head]>
  : $acc;

export interface Map<Fn extends Kind> extends Kind {
  return: MapImpl<this['rawArgs'], Fn>;
}
