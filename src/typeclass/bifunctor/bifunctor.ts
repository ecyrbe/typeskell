import { Equal, Expect } from 'type-testing';
import type { Kind } from '@kinds';
import { TypeSkell } from '@typeskell';
import { $mapLeft, $mapRight, $bitap, $tapLeft, $tapRight } from './bifunctor.impl';
export namespace BiFunctor {
  export type $bimap<F extends Kind> = TypeSkell<'(a -> b) (c -> d) -> F a c ..e -> F b d ..e', { F: F }>;
  export type $mapLeft<F extends Kind> = TypeSkell<'(a -> b) -> F a c ..e -> F b c ..e', { F: F }>;
  export type $mapRight<F extends Kind> = TypeSkell<'(a -> b) -> F c a ..e -> F c b ..e', { F: F }>;
  // prettier-ignore
  export type $bitap<F extends Kind> = TypeSkell<'(a -> empty) (b -> empty) -> F a b ..e -> F a b ..e', { F: F }, ['empty'], [void]>;
  // prettier-ignore
  export type $tapLeft<F extends Kind> = TypeSkell<'(a -> empty) -> F a b ..e -> F a b ..e', { F: F }, ['empty'], [void]>;
  // prettier-ignore
  export type $tapRight<F extends Kind> = TypeSkell<'(b -> empty) -> F a b ..e -> F a b ..e', { F: F }, ['empty'], [void]>;
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
export interface BiFunctor<F extends Kind> {
  /**
   * bimap :: `(a -> b) (c -> d) -> F a c -> F b d`
   */
  bimap: BiFunctor.$bimap<F>;
}

/**
 * mapLeft :: `BiFunctor F -> (a -> b) -> F a c -> F b c`
 */
export const mapLeft: <F extends Kind>(bifunctor: BiFunctor<F>) => BiFunctor.$mapLeft<F> = $mapLeft as any;

/**
 * mapRight :: `BiFunctor F  -> (a -> b) -> F c a -> F c b`
 */
export const mapRight: <F extends Kind>(bifunctor: BiFunctor<F>) => BiFunctor.$mapRight<F> = $mapRight as any;

export const bitap: <F extends Kind>(bifunctor: BiFunctor<F>) => BiFunctor.$bitap<F> = $bitap as any;

export const tapLeft: <F extends Kind>(bifunctor: BiFunctor<F>) => BiFunctor.$tapLeft<F> = $tapLeft as any;

export const tapRight: <F extends Kind>(bifunctor: BiFunctor<F>) => BiFunctor.$tapRight<F> = $tapRight as any;

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [
  Expect<Equal<typeof mapLeft<Kind.F2>, typeof $mapLeft>>,
  Expect<Equal<typeof mapRight<Kind.F2>, typeof $mapRight>>,
  Expect<Equal<typeof bitap<Kind.F2>, typeof $bitap>>,
  Expect<Equal<typeof tapLeft<Kind.F2>, typeof $tapLeft>>,
  Expect<Equal<typeof tapRight<Kind.F2>, typeof $tapRight>>,
];
