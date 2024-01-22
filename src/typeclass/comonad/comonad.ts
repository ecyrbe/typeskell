import { Kind } from '@kinds';
import { Functor } from '@typeclass/functor';
import { TypeSkell } from '@typeskell';
import { duplicate as duplicateImpl } from './comonad.impl';
import { Expect, Equal } from 'type-testing';

/**
 * CoMonad is a typeclass that defines two operations, extract and extend.
 * It is a generalization of Functor.
 *
 * Laws:
 * - Left Identity: extract . extend f = f
 * - Right Identity: extend extract = id
 * - Associativity: extend f . extend g = extend (f . extend g)
 *
 */
export interface CoMonad<F extends Kind> extends Functor<F> {
  extract: TypeSkell<'F a ..e -> a', { F: F }>;
  extend: TypeSkell<'(F a ..e -> b) -> F a ..e -> F b ..e', { F: F }>;
}

export const duplicate: <F extends Kind>(coMonad: CoMonad<F>) => TypeSkell<'F a ..e -> F (F a ..e) ..e', { F: F }> =
  duplicateImpl as any;

type TestCases = [Expect<Equal<typeof duplicate<Kind.F>, typeof duplicateImpl>>];
