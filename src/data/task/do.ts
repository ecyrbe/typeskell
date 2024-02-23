import { Functor, Monad } from './task';
import * as tFunctor from '@typeclass/functor';
import * as tMonad from '@typeclass/monad';

/**
 * Do notation for Task
 * it allows you to chain multiple Task computations together
 * and not worry about the None case
 *
 * @example
 * ```ts
 * pipe(
 *  Do,
 *  bind('a', () => some(1)),
 *  bind('b', ({ a }) => some(a + 1)),
 *  map(({ a, b }) => a + b),
 * )
 * ```
 */
export const Do = Monad.of({});

/**
 * bind an Task to a name
 * @param name name of the Task
 * @param f function that returns an Task
 * @returns Task with the name binded
 *
 * @example
 * ```ts
 * pipe(
 *  Do,
 *  bind('a', () => some(1)),
 *  bind('b', ({ a }) => some(a + 1)),
 *  map(({ a, b }) => a + b),
 * )
 * ```
 */
export const bind = tMonad.bind(Monad);

const $let = tFunctor.let(Functor);
export { $let as let };
