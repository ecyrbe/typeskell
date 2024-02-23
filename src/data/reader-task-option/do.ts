import { Functor, Monad } from './reader-task-option';
import * as tFunctor from '@typeclass/functor';
import * as tMonad from '@typeclass/monad';

/**
 * Do notation for ReaderTaskOption
 * it allows you to chain multiple ReaderTaskOption computations together
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
 * bind an ReaderTaskOption to a name
 * @param name name of the ReaderTaskOption
 * @param f function that returns a ReaderTaskOption
 * @returns ReaderTaskOption with the name binded
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
