import type { Kind, $ } from '@kinds';
import type { SplitAt } from '@utils/tuples';
import type { Add, Dec } from '@utils/numbers';
import { type GenericFn, apply } from '@utils/functions';
import { Expect, Equal } from 'type-testing';
import { functor } from 'fp-ts';
import { pipe } from '../pipe';

export interface FunctorParams<F extends Kind, A> extends Kind {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, [A, ...this['rawArgs']]>] : never;
}

export interface FunctorResult<F extends Kind, B> extends Kind {
  return: this['rawArgs'] extends unknown[] ? $<F, [B, ...this['rawArgs']]> : never;
}

/**
 * Functor is a typeclass that defines a single operation, map.
 *
 * Laws:
 *  - Identity: map id = id
 *  - Composition: map (f . g) = map f . map g
 */
export interface Functor<F extends Kind> {
  /**
   * map :: `(a -> b) -> F a -> F b`
   *
   * map :: `<A,B>(f: (a: A) => B) => <...>(fa: $<F, [A,...]>) => $<F, [B,...]>`
   *
   * @param f `a -> b`
   * @returns `F a -> F b`
   */
  map: <A, B>(f: (a: A) => B) => GenericFn<Dec<F['arity']>, FunctorParams<F, A>, FunctorResult<F, B>>;
}

/**
 * mapCompose :: `Functor<F> Functor<G> -> (a -> b) -> F (G a) -> F (G b)`
 *
 * mapCompose :: `<F,G>(ff: Functor<F> gg: Functor<G>) => <A,B>(f: (a: A) => B) => <...Cf,...Cg>(fa: $<F, [$<G,[A,...Cg]>,...Cf]>) => $<F, [$<G,[B,...Cg]>,...Cf]>`
 *
 * @param FunctorF `Functor<F>`
 * @param FunctorG `Functor<G>`
 * @returns `(a -> b) -> F (G a) -> F (G b)`
 */
export const mapCompose =
  <F extends Kind, G extends Kind>(
    FunctorF: Functor<F>,
    FunctorG: Functor<G>,
  ): (<A, B>(
    f: (a: A) => B,
  ) => GenericFn<
    Add<Dec<F['arity']>, Dec<G['arity']>>,
    FunctorCompositionParams<F, G, A>,
    FunctorCompositionResult<F, G, B>
  >) =>
  f =>
    _mapCompose(FunctorF as any, FunctorG as any)(f) as any;

export const _mapCompose =
  (FunctorF: Functor<Kind.F>, FunctorG: Functor<Kind.G>) =>
  <A, B>(f: (a: A) => B) =>
    FunctorF.map(FunctorG.map(f));

interface FunctorCompositionParams<F extends Kind, G extends Kind, A> extends Kind {
  return: this['rawArgs'] extends unknown[]
    ? SplitAt<Dec<F['arity']>, this['rawArgs']> extends [infer FB extends unknown[], infer GB extends unknown[]]
      ? [fa: $<F, [$<G, [A, ...GB]>, ...FB]>]
      : never
    : never;
}

interface FunctorCompositionResult<F extends Kind, G extends Kind, B> extends Kind {
  return: this['rawArgs'] extends unknown[]
    ? SplitAt<Dec<F['arity']>, this['rawArgs']> extends [infer FB extends unknown[], infer GB extends unknown[]]
      ? $<F, [$<G, [B, ...GB]>, ...FB]>
      : never
    : never;
}

interface FlapParams<F extends Kind, A> extends Kind {
  return: this['rawArgs'] extends [infer B, ...infer Rest] ? [fab: $<F, [(a: A) => B, ...Rest]>] : never;
}

interface FlapResult<F extends Kind> extends Kind {
  return: this['rawArgs'] extends unknown[] ? $<F, [...this['rawArgs']]> : never;
}

const _flap =
  (functor: Functor<Kind.F>) =>
  <A>(a: A) =>
    functor.map(apply(a));

/**
 * flap :: `Functor F -> a -> F (a -> b) -> F b`
 *
 * flap :: `<F>(f: Functor<F>) => <A>(a: A) => <B,...>(fab: $<F, [(a: A) => B, ...]>) => $<F, [B, ...]>`
 *
 * @param functor `Functor<F>`
 * @returns `a -> F (a -> b) -> F b`
 */
export const flap =
  <F extends Kind>(functor: Functor<F>) =>
  <A>(a: A): GenericFn<F['arity'], FlapParams<F, A>, FlapResult<F>> =>
    _flap(functor as any)(a) as any;

interface FunctorAsParams<F extends Kind> extends Kind {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, this['rawArgs']>] : never;
}
interface FunctorAsResult<F extends Kind, B> extends Kind {
  return: this['rawArgs'] extends [any, ...infer Args] ? $<F, [B, ...Args]> : never;
}

const _as =
  (functor: Functor<Kind.F>) =>
  <B>(b: B) =>
  <A>(fa: $<Kind.F, [A]>) =>
    pipe(
      fa,
      functor.map(() => b),
    );

export const as =
  <F extends Kind>(functor: Functor<F>) =>
  <B>(b: B): GenericFn<F['arity'], FunctorAsParams<F>, FunctorAsResult<F, B>> =>
    _as(functor as any)(b) as any;

type TestCases = [
  Expect<Equal<typeof mapCompose<Kind.F, Kind.G>, typeof _mapCompose>>,
  Expect<Equal<typeof flap<Kind.F>, typeof _flap>>,
  Expect<Equal<typeof as<Kind.F>, typeof _as>>,
];
