import { Expect, Equal } from 'type-testing';
import type { Kind } from '@kinds';
import { as as asImpl, flap as flapImpl, mapCompose as mapComposeImpl } from './functor.impl';
import { TypeSkell } from '@typeskell';

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
   * @param f `a -> b`
   * @returns `F a -> F b`
   */
  map: TypeSkell<'(a -> b) -> F a ..e -> F b ..e', { F: F }>;
}

/**
 * mapCompose :: `Functor<F> Functor<G> -> (a -> b) -> F (G a) -> F (G b)`
 *
 * @param FunctorF `Functor<F>`
 * @param FunctorG `Functor<G>`
 * @returns `(a -> b) -> F (G a) -> F (G b)`
 */
export const mapCompose: <F extends Kind, G extends Kind>(
  FunctorF: Functor<F>,
  FunctorG: Functor<G>,
) => TypeSkell<'(a -> b) -> F (G a ..x) ..y -> F (G b ..x) ..y', { F: F; G: G }> = mapComposeImpl as any;

/**
 * flap :: `Functor F -> a -> F (a -> b) -> F b`
 *
 * @param functor `Functor<F>`
 * @returns `a -> F (a -> b) -> F b`
 */
export const flap: <F extends Kind>(functor: Functor<F>) => TypeSkell<'a -> F (a -> b) ..x -> F b ..x', { F: F }> =
  flapImpl as any;

/**
 * as :: `Functor F -> b -> F a -> F b`
 *
 * @param functor `Functor<F>`
 * @returns `b -> F a -> F b`
 */
export const as: <F extends Kind>(functor: Functor<F>) => TypeSkell<'b -> F a ..x -> F b ..x', { F: F }> =
  asImpl as any;

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [
  Expect<Equal<typeof mapCompose<Kind.F, Kind.G>, typeof mapComposeImpl>>,
  Expect<Equal<typeof flap<Kind.F>, typeof flapImpl>>,
  Expect<Equal<typeof as<Kind.F>, typeof asImpl>>,
];
