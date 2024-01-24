import type { Kind } from '@kinds';
import type { Functor } from '@typeclass/functor';
import type { Of } from '@typeclass/of';
import type { TypeSkell } from '@typeskell';
import type { TPair } from '@data/pair';
import type { TArray } from '@data/array';
import { liftA2 as liftA2Impl, product as productImpl, productMany as productManyImpl } from './applicative.impl';
import { Expect, Equal } from 'type-testing';

export namespace Applicative {
  export type $ap<F extends Kind> = TypeSkell<'F a ..x -> F (a -> b) ..y -> F b ..xy', { F: F }>;
  export type $liftA2<F extends Kind> = TypeSkell<'(a b -> c) -> F a ..x -> F b ..y -> F c ..xy', { F: F }>;
  export type $product<F extends Kind> = TypeSkell<'F a ..x -> F b ..y -> F (Pair a b) ..xy', { F: F; Pair: TPair }>;
  export type $productMany<F extends Kind> = TypeSkell<
    'F a ..x -> Array (F a ..x) -> F (Array a) ..x',
    { F: F; Array: TArray }
  >;
}

/**
 * Applicative is a typeclass that provides a way to apply a function in a context to a value in a context.
 *
 * Laws:
 * - Identity: ap (of id) v = v
 * - Homomorphism: ap (of f) (of x) = of (f x)
 * - Interchange: ap u (of y) = ap (of (\f -> f y)) u
 * - Composition: ap (ap (ap (of (.)) u) v) w = ap u (ap v w)
 */
export interface Applicative<F extends Kind> extends Functor<F>, Of<F> {
  /**
   * ap :: `F a -> F (a -> b) -> F b`
   *
   * @param fa `F a`
   * @returns `F (a -> b) -> F b`
   */
  ap: Applicative.$ap<F>;
}

/**
 * liftA2 :: `Applicative F -> (a b -> c) -> F a -> F b -> F c`
 */
export const liftA2: <F extends Kind>(applicative: Applicative<F>) => Applicative.$liftA2<F> = liftA2Impl as any;

/**
 * product :: `Applicative F -> F a -> F b -> F (Pair a b)`
 */
export const product: <F extends Kind>(applicative: Applicative<F>) => Applicative.$product<F> = productImpl as any;

/**
 * productMany :: `Applicative F -> Iterable (F a) -> F (NonEmptyArray a)`
 */
export const productMany: <F extends Kind>(applicative: Applicative<F>) => Applicative.$productMany<F> =
  productManyImpl as any;

type TestCases = [
  Expect<Equal<typeof liftA2<Kind.F>, typeof liftA2Impl>>,
  Expect<Equal<typeof product<Kind.F>, typeof productImpl>>,
  Expect<Equal<typeof productMany<Kind.F>, typeof productManyImpl>>,
];
