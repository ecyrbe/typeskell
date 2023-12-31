import type { Kind, $ } from "@kinds";
import type { Functor } from "@typeclass/functor";
import type { Of } from "@typeclass/of";
import type { GenericFn } from "@utils/functions";
import { ZipWithVariance } from "../kinds/variance";
import { Tail } from "@utils/tuples";

interface ApParams<F extends Kind> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? [fa: $<F, this["rawArgs"]>]
    : never;
}

interface ApResult<F extends Kind> extends Kind {
  return: this["rawArgs"] extends [infer A, ...infer Af]
    ? GenericFn<F["arity"], ApFabParams<F, A>, ApFabResult<F, Af>, "B">
    : never;
}

interface ApFabParams<F extends Kind, A> extends Kind {
  return: this["rawArgs"] extends [infer B, ...infer Bf]
    ? [fab: $<F, [(a: A) => B, ...Bf]>]
    : never;
}

interface ApFabResult<F extends Kind, Af> extends Kind {
  return: this["rawArgs"] extends [infer B, ...infer Bf]
    ? $<F, [B, ...ZipWithVariance<Af, Bf, Tail<F["signature"]>>]>
    : never;
}

/**
 * Applicative is a typeclass that provides a way to apply a function in a context to a value in a context.
 *
 * Laws:
 * - Identity: `pipe(of(id), ap(a)) = a`
 * - Homomorphism: `pipe(of(f), ap(of(a))) = of(f(a))`
 * - Interchange: `pipe(a, ap(of(f))) = pipe(of(f), ap(a))`
 * - Composition: `pipe(a, ap(pipe(b, ap(pipe(c, ap(of(compose))))))) = pipe(pipe(a, ap(b)), ap(c))`
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
  ap: GenericFn<F["arity"], ApParams<F>, ApResult<F>>;
}
