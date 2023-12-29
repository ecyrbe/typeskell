import type { Kind, $ } from "@kinds";
import type { SplitAt } from "@utils/tuples";
import type { Add, Dec, Inc } from "@utils/numbers";
import { type BuildGenericFn, apply } from "@utils/functions";

interface FunctorParams<F extends Kind, A> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? [fa: $<F, [A, ...this["rawArgs"]]>]
    : never;
}

interface FunctorResult<F extends Kind, B> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? $<F, [B, ...this["rawArgs"]]>
    : never;
}

//<A, B>(f: (a: A) => B) => <...>(fa: $<F, [A,...]>) => $<F, [B,...]>
export interface Functor<F> {
  map: F extends Kind
    ? <A, B>(
        f: (a: A) => B
      ) => BuildGenericFn<F["length"], FunctorParams<F, A>, FunctorResult<F, B>>
    : never;
}

// <A, B>(f: (a: A) => B) => <...F,...G>(fa: $<F, [$<G,[A,...G]>,...F]>) => $<F, [$<G,[B,...G]>,...F]>
export const mapComposition =
  <F extends Kind, G extends Kind>(
    FunctorF: Functor<F>,
    FunctorG: Functor<G>
  ): (<A, B>(
    f: (a: A) => B
  ) => BuildGenericFn<
    Add<Dec<F["length"]>, G["length"]>,
    FunctorCompositionParams<F, G, A>,
    FunctorCompositionResult<F, G, B>
  >) =>
  // @ts-ignore
  (f) =>
    FunctorF.map(FunctorG.map(f));

interface FunctorCompositionParams<F extends Kind, G extends Kind, A>
  extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? SplitAt<Dec<F["length"]>, this["rawArgs"]> extends [
        infer FB extends unknown[],
        infer GB extends unknown[],
      ]
      ? [fa: $<F, [$<G, [A, ...GB]>, ...FB]>]
      : never
    : never;
}

interface FunctorCompositionResult<F extends Kind, G extends Kind, B>
  extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? SplitAt<Dec<F["length"]>, this["rawArgs"]> extends [
        infer FB extends unknown[],
        infer GB extends unknown[],
      ]
      ? $<F, [$<G, [B, ...GB]>, ...FB]>
      : never
    : never;
}

interface FlapParams<F extends Kind, A> extends Kind {
  return: this["rawArgs"] extends [infer B, ...infer Rest]
    ? [fab: $<F, [(a: A) => B, ...Rest]>]
    : never;
}

interface FlapResult<F extends Kind> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? $<F, [...this["rawArgs"]]>
    : never;
}
// <A>(a:A) => <B>(fab: $<F,[(a:A)=> B]>) => $<F, [B]>
export const flap =
  <F extends Kind>(Functor: Functor<F>) =>
  <A>(
    a: A
  ): BuildGenericFn<Inc<F["length"]>, FlapParams<F, A>, FlapResult<F>> =>
    // @ts-ignore
    Functor.map(apply(a));
