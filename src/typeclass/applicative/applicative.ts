import type { Kind } from '@kinds';
import type { Functor } from '@typeclass/functor';
import type { Of } from '@typeclass/of';
import { TypeSkell } from '@typeskell';

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
   * ap :: `<A,...Af>(fa: $<F, [A,...Af]>) => <B,...Bf>(fab: $<F, [(a: A) => B,...Bf]>) => $<F, [B,...ZipWithVariance<Af,Bf>]>`
   *
   * @param fa `F a`
   * @returns `F (a -> b) -> F b`
   */
  ap: TypeSkell<'F a ..x -> F (a -> b) ..y -> F b ..xy', { F: F }>;
}
