import { Expect, Equal } from 'type-testing';
import type { Kind } from '@kinds';
import { $as, $flap, $mapCompose, $let } from './functor.impl';
import { TypeSkell } from '@typeskell';

export namespace Functor {
  export type $map<F extends Kind> = TypeSkell<'(a -> b) -> F a ..e -> F b ..e', { F: F }>;
  export type $mapCompose<F extends Kind, G extends Kind> = TypeSkell<
    '(a -> b) -> F (G a ..x) ..y -> F (G b ..x) ..y',
    { F: F; G: G }
  >;
  export type $flap<F extends Kind> = TypeSkell<'a -> F (a -> b) ..x -> F b ..x', { F: F }>;
  export type $as<F extends Kind> = TypeSkell<'b -> F a ..x -> F b ..x', { F: F }>;
  export type $let<F extends Kind> = TypeSkell<
    '(DoName n a) (a -> b) -> F a ..e -> F (Do n a b) ..e',
    { DoName: Kind.DoName; Do: Kind.Do; F: F }
  >;
}

// <Name extends string, A, B>(name: Exclude<Name, keyof A>, f: (a: A) => B) =>
//   (fa: Array<A>): BindArray<Name, A, B>
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
  map: Functor.$map<F>;
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
) => Functor.$mapCompose<F, G> = $mapCompose as any;

/**
 * flap :: `Functor F -> a -> F (a -> b) -> F b`
 *
 * @param functor `Functor<F>`
 * @returns `a -> F (a -> b) -> F b`
 */
export const flap: <F extends Kind>(functor: Functor<F>) => Functor.$flap<F> = $flap as any;

/**
 * as :: `Functor F -> b -> F a -> F b`
 *
 * @param functor `Functor<F>`
 * @returns `b -> F a -> F b`
 */
export const as: <F extends Kind>(functor: Functor<F>) => Functor.$as<F> = $as as any;

const $$let: <F extends Kind>(functor: Functor<F>) => Functor.$let<F> = $let as any;

export { $$let as let };

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [
  Expect<Equal<typeof mapCompose<Kind.F, Kind.G>, typeof $mapCompose>>,
  Expect<Equal<typeof flap<Kind.F>, typeof $flap>>,
  Expect<Equal<typeof as<Kind.F>, typeof $as>>,
];
