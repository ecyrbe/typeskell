import type { Kind, $ } from "@kinds";
import type { Functor } from "@typeclass/functor";

export interface Applicative<F extends Kind> extends Functor<F> {
  return: <A>(a: A) => $<F, [A]>;
  ap: <A, B>(fab: $<F, [(a: A) => B]>) => (fa: $<F, [A]>) => $<F, [B]>;
}
