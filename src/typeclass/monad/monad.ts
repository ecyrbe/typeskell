import { Kind } from '@kinds';
import { FlapMapSignature, FlattenSignature } from './monad.types';
import { Applicative } from '@typeclass/applicative';
import { flatten as flattenImpl } from './monad.impl';
import { Expect, Equal } from 'type-testing';

export interface Monad<F extends Kind> extends Applicative<F> {
  //(a -> F1 b) -> F2 a -> F12 b', {F: 3}) // '<A1, A2, A3, A4>(f: (a: A1) => F<A2, A3, A4>) => <B1, B2>(fa: F<A1, B1, B2>) => F<A2, A3|B1, A4|B2>'
  /**
   * flatMap :: `(a -> F b) -> F a -> F b`
   *
   * flatMap :: `<A,B,...Bf>(f: (a: A) => $<F, [B,...Bf]>) => <..Af>(fa: $<F, [A,...Af]>) => $<F, [B,...ZipWithVariance<Af,Bf>>]>`
   */
  flatMap: FlapMapSignature<F>;
}

/**
 * flatten :: `Monad M => M (M a) -> M a`
 *
 * flatten :: `<M>(m: Monad<M>) => <A>(mma: $<M, [$<M,[A]>]>) => $<M, [A]>`
 */
export const flatten = <M extends Kind>(m: Monad<M>): FlattenSignature<M> => flattenImpl as any;

type TestCases = [Expect<Equal<typeof flatten<Kind.F2>, typeof flattenImpl>>];
