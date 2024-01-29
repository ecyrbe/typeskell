import { Functor, Monad } from './generator';
import * as tFunctor from '@typeclass/functor';
import * as tMonad from '@typeclass/monad';

/**
 * Do notation for Option
 * it allows you to chain multiple Option computations together
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
export const Do: Generator<{}> = Monad.of({});

/**
 * bind an option to a name
 * @param name name of the option
 * @param f function that returns an option
 * @returns Option with the name binded
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
