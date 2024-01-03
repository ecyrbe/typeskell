import { Equal, Expect } from 'type-testing';
import type { HKT, $ } from '@kinds';
import type { Dec, Sub } from '@utils/numbers';
import { type GenericFn, identity } from '@utils/functions';
import type { FunctorParams, FunctorResult } from '@typeclass/functor/functor.types';

interface BiFunctorParams<F extends HKT, A, C> extends HKT {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, [A, C, ...this['rawArgs']]>] : never;
}

interface BiFunctorResult<F extends HKT, B, D> extends HKT {
  return: this['rawArgs'] extends unknown[] ? $<F, [B, D, ...this['rawArgs']]> : never;
}

/**
 * BiFunctor is a typeclass that defines a single operation, bimap.
 * It is a generalization of Functor.
 *
 * Definition for mapLeft and mapRight are derived from bimap.
 *  - mapLeft f  = bimap f id
 *  - mapRight f = bimap id f
 *
 * Laws:
 * - Identity: bimap id id = id
 * - Composition: bimap (f . g) (h . i) = bimap f h  . bimap g i
 */
export interface BiFunctor<F extends HKT> {
  /**
   * bimap :: `(a -> b) (c -> d) -> F a c -> F b d`
   *
   * bimap :: `<A,B,C,D>(f: (a: A) => B, g: (c: C) => D) => <...>(fac: $<F, [A,C,...]>) => $<F, [B,D,...]>`
   *
   * @param f `a -> b`
   * @param g `c -> d`
   * @returns `F a c -> F b d`
   */
  bimap: <A, B, C, D>(
    f: (a: A) => B,
    g: (e: C) => D,
  ) => GenericFn<Sub<F['arity'], 2>, BiFunctorParams<F, A, C>, BiFunctorResult<F, B, D>>;
}

const _mapLeft =
  (bifunctor: BiFunctor<HKT.F2>) =>
  <A, B>(f: (a: A) => B) =>
    bifunctor.bimap(f, identity);

/**
 * mapLeft :: `BiFunctor F -> (a -> b) -> F a c -> F b c`
 *
 * mapLeft :: `<F>(bif: BiFunctor<F>) => <A,B>(f: (a: A) => B) => <C,...>(fac: $<F, [A,C,...]>) => $<F, [B,C,...]>`
 *
 * @param bifunctor `BiFunctor<F>`
 * @returns `(a -> b) -> F a c -> F b c`
 */
export const mapLeft: <F extends HKT>(
  bifunctor: BiFunctor<F>,
) => <A, B>(f: (a: A) => B) => GenericFn<Dec<F['arity']>, FunctorParams<F, A>, FunctorResult<F, B>> = _mapLeft as any;

export interface BiFunctorRightParams<F extends HKT, A> extends HKT {
  return: this['rawArgs'] extends [infer C, ...infer Args] ? [fac: $<F, [C, A, ...Args]>] : never;
}

export interface BiFunctorRightResult<F extends HKT, B> extends HKT {
  return: this['rawArgs'] extends [infer C, ...infer Args] ? $<F, [C, B, ...Args]> : never;
}

const _mapRight =
  (bifunctor: BiFunctor<HKT.F2>) =>
  <A, B>(f: (a: A) => B) =>
    bifunctor.bimap(identity, f);

/**
 * mapRight :: `BiFunctor F  -> (a -> b) -> F c a -> F c b`
 *
 * mapRight :: `<F>(bif: BiFunctor<F>) => <A,B>(f: (a: A) => B) => <C,...>(fac: $<F, [C,A,...]>) => $<F, [C,B,...]>`
 *
 * @param bifunctor `BiFunctor<F>`
 * @returns `(a -> b) -> F c a -> F c b`
 */
export const mapRight: <F extends HKT>(
  bifunctor: BiFunctor<F>,
) => <A, B>(f: (a: A) => B) => GenericFn<Dec<F['arity']>, BiFunctorRightParams<F, A>, BiFunctorRightResult<F, B>> =
  _mapRight as any;

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [
  Expect<Equal<typeof mapLeft<HKT.F2>, typeof _mapLeft>>,
  Expect<Equal<typeof mapRight<HKT.F2>, typeof _mapRight>>,
];
