import type { Kind } from '@kinds';
import type { Functor } from '@typeclass/functor';
import type { Of } from '@typeclass/of';
import { TypeSkell } from '@typeskell';
import { TPair } from '@data/pair';
import { liftA2 as liftA2Impl, product as productImpl } from './applicative.impl';
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
  ap: TypeSkell<'F a ..x -> F (a -> b) ..y -> F b ..xy', { F: F }>;
}

export const liftA2: <F extends Kind>(
  applicative: Applicative<F>,
) => TypeSkell<'(a b -> c) -> (F a ..x) -> (F b ..y) -> F c ..xy', { F: F }> = liftA2Impl as any;

export const product: <F extends Kind>(
  applicative: Applicative<F>,
) => TypeSkell<'(F a ..x) -> (F b ..y) -> F (Pair a b) ..xy', { F: F; Pair: TPair }> = productImpl as any;
