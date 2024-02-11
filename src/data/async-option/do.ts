import { Functor, Monad } from './async-option';
import * as tFunctor from '@typeclass/functor';
import * as tMonad from '@typeclass/monad';

/**
 * Do notation for AsyncOption
 * it allows you to chain multiple AsyncOption computations together
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
 * bind an AsyncOption to a name
 * @param name name of the AsyncOption
 * @param f function that returns an AsyncOption
 * @returns AsyncOption with the name binded
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
