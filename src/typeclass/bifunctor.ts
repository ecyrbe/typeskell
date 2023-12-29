import type { Kind, $ } from "@kinds";
import type { Dec } from "@utils/numbers";
import { type BuildGenericFn, identity } from "@utils/functions";
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

// <A,B,C,D>(f: (a: A) => B, g: (c: C) => D) => <...>(fac: $<F, [A,C,...]>) => $<F, [B,D,...]>
export interface BiFunctor<F> {
  bimap: F extends Kind
    ? <A, B, C, D>(
        f: (a: A) => B,
        g: (e: C) => D
      ) => BuildGenericFn<
        Dec<F["length"]>,
        BiFunctorParams<F, A, C>,
        BiFunctorResult<F, B, D>
      >
    : never;
}

export const mapLeft =
  <F extends Kind>(bifunctor: BiFunctor<F>) =>
  <A, B>(
    f: (a: A) => B
  ): BuildGenericFn<F["length"], FunctorParams<F, A>, FunctorResult<F, B>> =>
    // @ts-ignore
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

export const mapRight =
  <F extends Kind>(bifunctor: BiFunctor<F>) =>
  <A, B>(
    f: (a: A) => B
  ): BuildGenericFn<
    F["length"],
    BiFunctorRightParams<F, A>,
    BiFunctorRightResult<F, B>
  > =>
    // @ts-ignore
    bifunctor.bimap(identity, f);
