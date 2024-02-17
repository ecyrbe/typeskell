import { Functor, Monad } from './reader-io-option';
import * as tFunctor from '@typeclass/functor';
import * as tMonad from '@typeclass/monad';

/**
 * Do notation for ReaderIO
 * it allows you to chain multiple ReaderIO computations together
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
 * bind an ReaderIO to a name
 * @param name name of the ReaderIO
 * @param f function that returns a ReaderIO
 * @returns ReaderIO with the name binded
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
