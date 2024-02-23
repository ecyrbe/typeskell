import { Functor, Monad } from './task-option';
import * as tFunctor from '@typeclass/functor';
import * as tMonad from '@typeclass/monad';

/**
 * Do notation for TaskOption
 * it allows you to chain multiple TaskOption computations together
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
 * bind an TaskOption to a name
 * @param name name of the TaskOption
 * @param f function that returns an TaskOption
 * @returns TaskOption with the name binded
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
