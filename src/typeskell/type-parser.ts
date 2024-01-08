import type { HaskellAST, TypeContructorAST, UppercaseChars, GreekChars } from './ast/types';
import { ParseAST } from './ast/type-parser';
import type { TypeConstructorMap, TypeConstructorMapCompiler, TypeMap, TypeMapCompiler } from './types';
import { ZipWithVariance } from '@kinds/variance';

type NextAlphaMap = {
  A: 'B';
  B: 'C';
  C: 'D';
  D: 'E';
  E: 'F';
  F: 'G';
  G: 'H';
  H: 'I';
  I: 'J';
  J: 'K';
  K: 'L';
  L: 'M';
  M: 'N';
  N: 'O';
  O: 'P';
  P: 'Q';
  Q: 'R';
  R: 'S';
  S: 'T';
  T: 'U';
  U: 'V';
  V: 'W';
  W: 'X';
  X: 'Y';
  Y: 'Z';
  Z: 'A';
};

export type GetNextAlpha<alpha> = alpha extends keyof NextAlphaMap ? NextAlphaMap[alpha] : never;

/**
 * trick to combine multiple unions of objects into a single object
 * only works with objects not primitives
 * @param union - Union of objects
 * @returns Intersection of objects
 */
type UnionToIntersection<union> = (union extends any ? (k: union) => void : never) extends (
  k: infer intersection,
) => void
  ? intersection
  : never;

/**
 * get last element of union
 * @param Union - Union of any types
 * @returns Last element of union
 */
type GetUnionLast<Union> = UnionToIntersection<Union extends any ? () => Union : never> extends () => infer Last
  ? Last
  : never;

/**
 * Convert union to tuple
 * @param Union - Union of any types, can be union of complex, composed or primitive types
 * @returns Tuple of each elements in the union
 */
type UnionToTuple<Union, $tuple extends unknown[] = []> = [Union] extends [never]
  ? $tuple
  : UnionToTuple<Exclude<Union, GetUnionLast<Union>>, [GetUnionLast<Union>, ...$tuple]>;

type FilterSpreadParams<spread extends string, typemap extends TypeMapCompiler> = {
  [K in keyof typemap as K extends `${spread}${infer i extends number}` ? i : never]: typemap[K];
};

export type GetSpreadParams<
  spread extends string,
  typemap extends TypeMapCompiler,
  $filtered extends TypeMapCompiler = FilterSpreadParams<spread, typemap>,
> = UnionToTuple<$filtered[keyof $filtered]>;

export type MergeSpreadParams<
  F extends string,
  A extends string,
  B extends string,
  typemap extends TypeMapCompiler,
  typeconstructorMap extends TypeConstructorMapCompiler,
  $spreadA = GetSpreadParams<A, typemap>,
  $spreadB = GetSpreadParams<B, typemap>,
> = ZipWithVariance<$spreadA, $spreadB, typeconstructorMap[F]['signature']>;
