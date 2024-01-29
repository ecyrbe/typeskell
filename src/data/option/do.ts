import { Option, some, flatMap, map } from './option';
import { pipe } from '../../pipe';

/**
 * Do notation for Option
 * it allows you to chain multiple Option computations together
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
export const Do: Option<{}> = some({});

type BindOption<Name extends string, A, B> = Option<{ [K in Name | keyof A]: K extends keyof A ? A[K] : B }>;

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
 *  bind('a', () => some(1)),
 *  bind('b', ({ a }) => some(a + 1)),
 *  map(({ a, b }) => a + b),
 * )
 * ```
 */
export const bind =
  <Name extends string, A, B>(name: Exclude<Name, keyof A>, f: (a: A) => Option<B>) =>
  (fa: Option<A>): BindOption<Name, A, B> =>
    pipe(
      fa,
      flatMap(a =>
        pipe(
          f(a),
          map(b => ({ ...a, [name]: b }) as any),
        ),
      ),
    );

export const bindTo =
  <Name extends string>(name: Name) =>
  <A>(fa: Option<A>): BindOption<Name, {}, A> =>
    pipe(
      fa,
      map(a => ({ [name]: a }) as any),
    );

const let_ =
  <Name extends string, A, B>(name: Exclude<Name, keyof A>, f: (a: A) => B) =>
  (fa: Option<A>): BindOption<Name, A, B> =>
    pipe(
      fa,
      map(a => ({ ...a, [name]: f(a) }) as any),
    );

export { let_ as let };
