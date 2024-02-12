import { Functor, Monad } from './async-io-result';
import * as tFunctor from '@typeclass/functor';
import * as tMonad from '@typeclass/monad';

/**
 * Do notation for AsyncIOResult
 * it allows you to chain multiple AsyncIOResult computations together
 * and not worry about the None case
 *
 * @example
 * ```ts
 * pipe(
 *  Do,
 *  bind('a', () => of(1)),
 *  bind('b', ({ a }) => of(a + 1)),
 *  map(({ a, b }) => a + b),
 * )
 * ```
 */
export const Do = Monad.of({});

/**
 * bind an AsyncIOResult to a name
 * @param name name of the AsyncIOResult
 * @param f function that returns an AsyncIOResult
 * @returns AsyncIOResult with the name binded
 *
 * @example
 * ```ts
 * pipe(
 *  Do,
 *  bind('a', () => of(1)),
 *  bind('b', ({ a }) => of(a + 1)),
 *  map(({ a, b }) => a + b),
 * )
 * ```
 */
export const bind = tMonad.bind(Monad);

const $let = tFunctor.let(Functor);
export { $let as let };
