import type { Kind, $ } from "@kinds";
import type { SplitAt } from "@utils/tuples";
import type { Add, Dec, Inc } from "@utils/numbers";
import { type BuildGenericFn, apply } from "@utils/functions";

export interface FunctorParams<F extends Kind, A> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? [fa: $<F, [A, ...this["rawArgs"]]>]
    : never;
}

export interface FunctorResult<F extends Kind, B> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? $<F, [B, ...this["rawArgs"]]>
    : never;
}

export interface Functor<F> {
  /**
   * map :: (a -> b) -> F a -> F b
   *
   * map :: <A,B>(f: (a: A) => B) => <...>(fa: $<F, [A,...]>) => $<F, [B,...]>
   *
   * @param f : a -> b
   * @returns F a -> F b
   */
  map: F extends Kind
    ? <A, B>(
        f: (a: A) => B
      ) => BuildGenericFn<
        Dec<F["arity"]>,
        FunctorParams<F, A>,
        FunctorResult<F, B>
      >
    : never;
}

/**
 * mapComposition :: Functor<F> Functor<G> -> (a -> b) -> F (G a) -> F (G b)
 *
 * mapComposition :: <F,G>(ff: Functor<F> gg: Functor<G>) => <A,B>(f: (a: A) => B) => <...Cf,...Cg>(fa: $<F, [$<G,[A,...Cg]>,...Cf]>) => $<F, [$<G,[B,...Cg]>,...Cf]>
 *
 * @param FunctorF : Functor<F>
 * @param FunctorG : Functor<G>
 * @returns (a -> b) -> F (G a) -> F (G b)
 */
export const mapComposition =
  <F extends Kind, G extends Kind>(
    FunctorF: Functor<F>,
    FunctorG: Functor<G>
  ): (<A, B>(
    f: (a: A) => B
  ) => BuildGenericFn<
    Add<Dec<F["arity"]>, Dec<G["arity"]>>,
    FunctorCompositionParams<F, G, A>,
    FunctorCompositionResult<F, G, B>
  >) =>
  (f) =>
    // @ts-ignore F and G arity are not known at this time so inference fails
    FunctorF.map(FunctorG.map(f));

interface FunctorCompositionParams<F extends Kind, G extends Kind, A>
  extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? SplitAt<Dec<F["arity"]>, this["rawArgs"]> extends [
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
    ? SplitAt<Dec<F["arity"]>, this["rawArgs"]> extends [
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
/**
 * flap :: Functor<F> -> a -> F (a -> b) -> F b
 *
 * flap :: <F>(f: Functor<F>) => <A>(a: A) => <B,...>(fab: $<F, [(a: A) => B, ...]>) => $<F, [B, ...]>
 *
 * @param functor : Functor<F>
 * @returns a -> F (a -> b) -> F b
 */
export const flap =
  <F extends Kind>(functor: Functor<F>) =>
  <A>(a: A): BuildGenericFn<F["arity"], FlapParams<F, A>, FlapResult<F>> =>
    // @ts-ignore F arity is not known at this time so inference fails
    functor.map(apply(a));
