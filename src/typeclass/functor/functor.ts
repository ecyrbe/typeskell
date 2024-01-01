import { Expect, Equal } from 'type-testing';
import type { Kind } from '@kinds';
import type { Add, Dec } from '@utils/numbers';
import { type GenericFn } from '@utils/functions';
import {
  FlapParams,
  FlapResult,
  FunctorAsParams,
  FunctorAsResult,
  FunctorCompositionParams,
  FunctorCompositionResult,
  FunctorParams,
  FunctorResult,
} from './functor.types';
import { as as asImpl, flap as flapImpl, mapCompose as mapComposeImpl } from './functor.impl';

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
    mapComposeImpl(FunctorF as any, FunctorG as any)(f) as any;

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
    flapImpl(functor as any)(a) as any;

/**
 * as :: `Functor F -> b -> F a -> F b`
 *
 * as :: `<F>(f: Functor<F>) => <B>(b: B) => <A,...>(fa: $<F, [A,...]>) => $<F, [B,...]>`
 *
 * @param functor `Functor<F>`
 * @returns `b -> F a -> F b`
 */
export const as =
  <F extends Kind>(functor: Functor<F>) =>
  <B>(b: B): GenericFn<F['arity'], FunctorAsParams<F>, FunctorAsResult<F, B>> =>
    asImpl(functor as any)(b) as any;

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [
  Expect<Equal<typeof mapCompose<Kind.F, Kind.G>, typeof mapComposeImpl>>,
  Expect<Equal<typeof flap<Kind.F>, typeof flapImpl>>,
  Expect<Equal<typeof as<Kind.F>, typeof asImpl>>,
];
