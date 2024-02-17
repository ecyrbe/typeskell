import { Functor, Monad } from './reader';
import * as tFunctor from '@typeclass/functor';
import * as tMonad from '@typeclass/monad';

/**
 * Do notation for Reader
 * it allows you to chain multiple Reader computations together
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
 * bind an Reader to a name
 * @param name name of the Reader
 * @param f function that returns a Reader
 * @returns Reader with the name binded
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
