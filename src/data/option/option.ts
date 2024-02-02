import * as tfunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tFoldable from '@typeclass/foldable';
import * as tFilterable from '@typeclass/filterable';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import { pipe } from '@utils/pipe';
import { Option, None, Some, TOption } from './option.types';

export const none = <A = never>(): Option<A> => ({ _tag: 'None' });
export const some = <A>(a: A): Option<A> => ({ _tag: 'Some', value: a });

export const isNone = <A>(option: Option<A>): option is None<A> => option._tag === 'None';

export const isSome = <A>(option: Option<A>): option is Some<A> => option._tag === 'Some';

export const fromNullable = <A>(a: A | null | undefined): Option<A> => (a == null ? none() : some(a));

export const fromIterable = <A>(iterable: Iterable<A>): Option<A> => {
  const iterator = iterable[Symbol.iterator]();
  const next = iterator.next();
  return next.done ? none() : some(next.value);
};

export const toNullable = <A>(option: Option<A>): A | null => (isNone(option) ? null : option.value);

export const toUndefined = <A>(option: Option<A>): A | undefined => (isNone(option) ? undefined : option.value);

export const Zero: tZero.Zero<TOption> = {
  zero: () => none(),
};

export const Of: tOf.Of<TOption> = {
  of: some,
};

export const To: tTo.To<TOption> = {
  getOrElse: f => fa => (isSome(fa) ? fa.value : f()),
};

export const Functor: tfunctor.Functor<TOption> = {
  map: f => fa => (isSome(fa) ? some(f(fa.value)) : none()),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TOption> = {
  ...Functor,
  or: fb => fa => (isSome(fa) ? fa : fb),
};

export const Foldable: tFoldable.Foldable<TOption> = {
  reduce: (f, b) => fa => (isSome(fa) ? f(b, fa.value) : b),
};

export const Filterable: tFilterable.Filterable<TOption> = {
  ...Zero,
  ...Functor,
  filterMap: f => fa => (isSome(fa) ? f(fa.value) : none()),
};

export const Applicative: tApplicative.Applicative<TOption> = {
  ...Of,
  ...Functor,
  ap: fa => fab => (isSome(fab) ? pipe(fa, Functor.map(fab.value)) : none()),
};

export const Alternative: tAlternative.Alternative<TOption> = {
  ...Zero,
  ...Applicative,
  ...SemiAlternative,
};

export const Monad: tMonad.Monad<TOption> = {
  ...Applicative,
  flatMap: f => fa => (isSome(fa) ? f(fa.value) : none()),
};

/**
 * produce an none Option of type a
 *
 * zero :: `() -> Option<a>`
 *
 * zero :: `<...>() => none`
 *
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe(zero(), map(x => x + 1)) // none
 * ```
 */
export const zero = Zero.zero;

/**
 * of :: `a -> Option<a>`
 *
 * of :: `<A>(a: A) => Option<A>`
 *
 * @param a any value
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe(1, of) // some(1)
 * ```
 */
export const of = Of.of;

/**
 * getOrElse :: `() -> b -> Option<a> -> a | b`
 *
 * getOrElse :: `<B>(f: () => B) => <A>(fa: Option<A>) => A | B`
 *
 * @param f `() -> b`
 * @returns `Option<a> -> a | b`
 *
 * @example
 * ```ts
 * pipe(some(1), getOrElse(() => 0)) // 1
 * pipe(none, getOrElse(() => 0)) // 0
 * ```
 */
export const getOrElse = To.getOrElse;

/**
 * getOr :: `b -> Option<a> -> a | b`
 *
 * getOr :: `<B>(b: B) => <A>(fa: Option<A>) => A | B`
 *
 * @param b `b`
 * @returns `Option<a> -> a | b`
 *
 * @example
 * ```ts
 * pipe(some(1), getOr(0)) // 1
 * pipe(none, getOr(0)) // 0
 * ```
 */
export const getOr = tTo.getOr(To);

/**
 * or :: `Option<a> -> Option<a> -> Option<a>`
 *
 * or :: `<A>(fb: Option<A>) => (fa: Option<A>) => Option<A>`
 *
 * @param fb `Option<a>`
 * @returns `Option<a> -> Option<a>`
 *
 * @example
 * ```ts
 * pipe(some(1), or(some(2))) // some(1)
 * pipe(some(1), or(none)) // some(1)
 * pipe(none, or(some(2))) // some(2)
 * pipe(none, or(none)) // none
 * ```
 */
export const or = SemiAlternative.or;

/**
 * map :: `(a -> b) -> Option<a> -> Option<b>`
 *
 * map :: `<A, B>(f: (a: A) => B) => (fa: Option<A>) => Option<B>`
 *
 * @param f `a -> b`
 * @returns `Option<a> -> Option<b>`
 *
 * @example
 * ```ts
 * pipe(some(1), map(x => x + 1)) // some(2)
 * pipe(none, map(x => x + 1)) // none
 * ```
 */
export const map = Functor.map;

/**
 * flap :: `a -> Option<(a -> b)> -> Option<b>`
 *
 * flap :: `<A>(a: A) => <B>(fab: Option<(a: A) => B>) => Option<B>`
 *
 * @param a `a`
 * @returns `Option<(a -> b)> -> Option<b>`
 *
 * @example
 * ```ts
 * pipe(some(x => x + 1), flap(0)) // some(1)
 * pipe(none, flap(0)) // none
 * ```
 */
export const flap = tfunctor.flap(Functor);

/**
 * as :: `b -> Option<a> -> Option<b>`
 *
 * as :: `<B>(b: B) => <A>(fa: Option<A>) => Option<B>`
 *
 * @param b `b`
 * @returns `Option<a> -> Option<b>`
 *
 * @example
 * ```ts
 * pipe(some(1), as(0)) // some(0)
 * pipe(none, as(0)) // none
 * ```
 */
export const as = tfunctor.as(Functor);

/**
 * doubleMap :: `(a -> b) -> Option<Option<a>> -> Option<Option<b>>`
 *
 * doubleMap :: `<A, B>(f: (a: A) => B) => (fa: Option<Option<A>>) => Option<Option<B>>`
 *
 * @param f `a -> b`
 * @returns `Option<Option<a>> -> Option<Option<b>>`
 *
 * @example
 * ```ts
 * pipe(some(some(1)), doubleMap(x => x + 1)) // some(some(2))
 * pipe(some(none), doubleMap(x => x + 1)) // some(none)
 * pipe(none, doubleMap(x => x + 1)) // none
 */
export const doubleMap = tfunctor.mapCompose(Functor, Functor);

/**
 * ap :: `Option<a> -> Option<(a -> b)> -> Option<b>`
 *
 * ap :: `<A>(fa: Option<A>) => <B>(fab: Option<(a: A) => B>) => Option<B>`
 *
 * @param fa : Option<a>
 * @returns fab: Option<(a -> b)> -> Option<b>
 *
 * @example
 * ```ts
 * pipe(of(x => x + 1), ap(some(1))) // some(2)
 * pipe(of(x => x + 1), ap(none)) // none
 * pipe(none, ap(some(1))) // none
 * pipe(none, ap(none)) // none
 * ```
 */
export const ap = Applicative.ap;

/**
 * flatMap :: `(a -> Option<b>) -> Option<a> -> Option<b>`
 *
 * flatMap :: `<A, B>(f: (a: A) => Option<B>) => (fa: Option<A>) => Option<B>`
 *
 * @param f `a -> Option<b>`
 * @returns `Option<a> -> Option<b>`
 *
 * @example
 * ```ts
 * pipe(some(1), flatMap(x => some(x + 1))) // some(2)
 * pipe(none, flatMap(x => some(x + 1))) // none
 * ```
 */
export const flatMap = Monad.flatMap;

/**
 * flatten :: `Option<Option<a>> -> Option<a>`
 *
 * flatten :: `<A>(ffa: Option<Option<A>>) => Option<A>`
 *
 * @param ffa `Option<Option<a>>`
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe(some(some(1)), flatten) // some(1)
 * pipe(some(none), flatten) // none
 * pipe(none, flatten) // none
 * ```
 */
export const flatten = tMonad.flatten(Monad);

/**
 * reduce :: `(b a -> b) b -> Option<a> -> b`
 *
 * reduce :: `<B>(f: (b: B, a: A) => B, b: B) => (fa: Option<A>) => B`
 *
 * @param f `(b a -> b) b`
 * @param b `b`
 * @returns `Option<a> -> b`
 *
 * @example
 * ```ts
 * pipe(some(1), reduce((b, a) => b + a, 0)) // 1
 * pipe(none, reduce((b, a) => b + a, 0)) // 0
 * ```
 */
export const reduce = Foldable.reduce;

/**
 * filterMap :: `(a -> Option<b>) -> Option<a> -> Option<b>`
 *
 * filterMap :: `<A, B>(f: (a: A) => Option<B>) => (fa: Option<A>) => Option<B>`
 *
 * @param f `(a -> Option<b>)`
 * @returns `Option<a> -> Option<b>`
 *
 * @example
 * ```ts
 * pipe(some(1), filterMap(x => x > 1 ? some(x) : none)) // none
 * pipe(some(2), filterMap(x => x > 1 ? some(x) : none)) // some(2)
 * pipe(none, filterMap(x => x > 1 ? some(x) : none)) // none
 * ```
 */
export const filterMap = Filterable.filterMap;

/**
 * filter :: `(a -> boolean) -> Option<a> -> Option<a>`
 *
 * filter :: `<A>(f: (a: A) => boolean) => (fa: Option<A>) => Option<A>`
 *
 * @param f `(a -> boolean)`
 * @returns `Option<a> -> Option<a>`
 *
 * @example
 * ```ts
 * pipe(some(1), filter(x => x > 1)) // none
 * pipe(some(2), filter(x => x > 1)) // some(2)
 * pipe(none, filter(x => x > 1)) // none
 * ```
 */
export const filter = tFilterable.filter(Filterable);

export const compact = tFilterable.compact(Filterable);

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
