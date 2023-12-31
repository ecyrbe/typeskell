import type { Kind, $ } from "@kinds";
import type { Functor } from "@typeclass/functor";
import type { Of } from "@typeclass/of";
import type { GenericFn } from "@utils/functions";
import { Add, Dec, Inc } from "@utils/numbers";

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
    ? $<F, [B, ...ZipWithUnion<Af, Bf>]>
    : never;
}

type ZipWithUnion<A, B, $acc extends unknown[] = []> = A extends [
  infer AHead,
  ...infer ATail,
]
  ? B extends [infer BHead, ...infer BTail]
    ? ZipWithUnion<ATail, BTail, [...$acc, AHead | BHead]>
    : ZipWithUnion<ATail, [], [...$acc, AHead]>
  : B extends [infer BHead, ...infer BTail]
    ? ZipWithUnion<[], BTail, [...$acc, BHead]>
    : $acc;

export interface Applicative<F extends Kind> extends Functor<F>, Of<F> {
  /**
   * ap :: `F a -> F (a -> b) -> F b`
   *
   * ap :: `<A,...Af>(fa: $<F, [A,...Af]>) => <B,...Bf>(fab: $<F, [(a: A) => B,...Bf]>) => $<F, [B,...ZipWithVariance<Af,Bf>]>`
   */
  ap: GenericFn<F["arity"], ApParams<F>, ApResult<F>>;
}
