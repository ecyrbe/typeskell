import { Equal, Expect } from 'type-testing';
import type { Kind } from '@kinds';
import { identity } from '@utils/functions';
import { TypeSkell } from '@typeskell';

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
export interface BiFunctor<F extends Kind> {
  /**
   * bimap :: `(a -> b) (c -> d) -> F a c -> F b d`
   *
   * bimap :: `<A,B,C,D>(f: (a: A) => B, g: (c: C) => D) => <...>(fac: $<F, [A,C,...]>) => $<F, [B,D,...]>`
   *
   * @param f `a -> b`
   * @param g `c -> d`
   * @returns `F a c -> F b d`
   */
  bimap: TypeSkell<'(a -> b) (c -> d) -> F a c ..e -> F b d ..e', { F: F }>;
}

const _mapLeft =
  (bifunctor: BiFunctor<Kind.F2>) =>
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
export const mapLeft: <F extends Kind>(
  bifunctor: BiFunctor<F>,
) => TypeSkell<'(a -> b) -> F a c ..e -> F b c ..e', { F: F }> = _mapLeft as any;

const _mapRight =
  (bifunctor: BiFunctor<Kind.F2>) =>
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
export const mapRight: <F extends Kind>(
  bifunctor: BiFunctor<F>,
) => TypeSkell<'(a -> b) -> F c a ..e -> F c b ..e', { F: F }> = _mapRight as any;

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [
  Expect<Equal<typeof mapLeft<Kind.F2>, typeof _mapLeft>>,
  Expect<Equal<typeof mapRight<Kind.F2>, typeof _mapRight>>,
];
