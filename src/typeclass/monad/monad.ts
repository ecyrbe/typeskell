import { Kind } from '@kinds';
import { Applicative } from '@typeclass/applicative';
import { $flatten, $bind } from './monad.impl';
import { Expect, Equal } from 'type-testing';
import { TypeSkell } from '@typeskell';

export namespace Monad {
  export type $flatMap<M extends Kind> = TypeSkell<'(a -> M b ..x) -> M a ..y -> M b ..xy', { M: M }>;
  export type $flatten<M extends Kind> = TypeSkell<'M (M a ..x) ..y -> M a ..xy', { M: M }>;
  export type $bind<F extends Kind> = TypeSkell<
    '(DoName n a) (a -> F b ..x) -> F a ..y -> F (Do n a b) ..xy',
    { DoName: Kind.DoName; Do: Kind.Do; F: F }
  >;
}

export interface Monad<F extends Kind> extends Applicative<F> {
  /**
   * flatMap :: `(a -> M b) -> M a -> M b`
   */
  flatMap: Monad.$flatMap<F>;
}

/**
 * flatten :: `Monad M => M (M a) -> M a`
 */
export const flatten: <M extends Kind>(m: Monad<M>) => Monad.$flatten<M> = $flatten as any;

/**
 * bind :: `Monad M => (DoName n a) (a -> M b) -> M a -> M (Do n a b)`
 */
export const bind: <F extends Kind>(f: Monad<F>) => Monad.$bind<F> = $bind as any;

type TestCases = [Expect<Equal<typeof flatten<Kind.F>, typeof $flatten>>];
