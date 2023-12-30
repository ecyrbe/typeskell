import type { Kind, $ } from "@kinds";
import type { Dec, Sub } from "@utils/numbers";
import { type GenericFn, identity } from "@utils/functions";
import type { FunctorParams, FunctorResult } from "@typeclass/functor";

interface BiFunctorParams<F extends Kind, A, C> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? [fa: $<F, [A, C, ...this["rawArgs"]]>]
    : never;
}

interface BiFunctorResult<F extends Kind, B, D> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? $<F, [B, D, ...this["rawArgs"]]>
    : never;
}

export interface BiFunctor<F> {
  /**
   * bimap :: (a -> b) (c -> d) -> F a c -> F b d
   *
   * bimap :: <A,B,C,D>(f: (a: A) => B, g: (c: C) => D) => <...>(fac: $<F, [A,C,...]>) => $<F, [B,D,...]>
   *
   * @param f : a -> b
   * @param g : c -> d
   * @returns F a c -> F b d
   */
  bimap: F extends Kind
    ? <A, B, C, D>(
        f: (a: A) => B,
        g: (e: C) => D
      ) => GenericFn<
        Sub<F["arity"], 2>,
        BiFunctorParams<F, A, C>,
        BiFunctorResult<F, B, D>
      >
    : never;
}

/**
 * mapLeft :: BiFunctor F -> (a -> b) -> F a c -> F b c
 *
 * mapLeft :: <F>(bif: BiFunctor<F>) => <A,B>(f: (a: A) => B) => <C,...>(fac: $<F, [A,C,...]>) => $<F, [B,C,...]>
 *
 * @param bifunctor : BiFunctor<F>
 * @returns (a -> b) -> F a c -> F b c
 */
export const mapLeft =
  <F extends Kind>(bifunctor: BiFunctor<F>) =>
  <A, B>(
    f: (a: A) => B
  ): GenericFn<Dec<F["arity"]>, FunctorParams<F, A>, FunctorResult<F, B>> =>
    // @ts-ignore F arity is not known at this time so inference fails
    bifunctor.bimap(f, identity);

export interface BiFunctorRightParams<F extends Kind, A> extends Kind {
  return: this["rawArgs"] extends [infer C, ...infer Args]
    ? [fa: $<F, [C, A, ...Args]>]
    : never;
}

export interface BiFunctorRightResult<F extends Kind, B> extends Kind {
  return: this["rawArgs"] extends [infer C, ...infer Args]
    ? $<F, [C, B, ...Args]>
    : never;
}

/**
 * mapRight :: BiFunctor F  -> (a -> b) -> F c a -> F c b
 *
 * mapRight :: <F>(bif: BiFunctor<F>) => <A,B>(f: (a: A) => B) => <C,...>(fac: $<F, [C,A,...]>) => $<F, [C,B,...]>
 *
 * @param bifunctor : BiFunctor<F>
 * @returns (a -> b) -> F c a -> F c b
 */
export const mapRight =
  <F extends Kind>(bifunctor: BiFunctor<F>) =>
  <A, B>(
    f: (a: A) => B
  ): GenericFn<
    Dec<F["arity"]>,
    BiFunctorRightParams<F, A>,
    BiFunctorRightResult<F, B>
  > =>
    // @ts-ignore F arity is not known at this time so inference fails
    bifunctor.bimap(identity, f);
