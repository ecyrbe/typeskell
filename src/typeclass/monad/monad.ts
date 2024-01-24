import { Kind } from '@kinds';
import { Applicative } from '@typeclass/applicative';
import { flatten as flattenImpl } from './monad.impl';
import { Expect, Equal } from 'type-testing';
import { TypeSkell } from '@typeskell';

export namespace Monad {
  export type $flatMap<M extends Kind> = TypeSkell<'(a -> M b ..x) -> M a ..y -> M b ..xy', { M: M }>;
  export type $flatten<M extends Kind> = TypeSkell<'M (M a ..x) ..y -> M a ..xy', { M: M }>;
}

export interface Monad<F extends Kind> extends Applicative<F> {
  /**
   * flatMap :: `(a -> F b) -> F a -> F b`
   */
  flatMap: Monad.$flatMap<F>;
}

/**
 * flatten :: `Monad M => M (M a) -> M a`
 */
export const flatten: <M extends Kind>(m: Monad<M>) => Monad.$flatten<M> = flattenImpl as any;

type TestCases = [Expect<Equal<typeof flatten<Kind.F>, typeof flattenImpl>>];
