import * as tfunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tNone from '@typeclass/none';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tFoldable from '@typeclass/foldable';
import * as tFilterable from '@typeclass/filterable';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import * as tSemiAlign from '@typeclass/semialign';
import { pipe } from '@utils/pipe';
import type { Option, TOption } from './option.types';

/**
 * produce none Option of type a
 *
 * none :: `() -> Option<a>`
 *
 * none :: `<...>() => none`
 *
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe(none(), map(x => x + 1)) // none
 * ```
 */
export const none = <A = never>(): Option<A> => ({ _tag: 'None' });

/**
 * produce some Option of type a
 *
 * some :: `a -> Option<a>`
 *
 * some :: `<A>(a: A) => Option<A>`
 *
 * @param a any value
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe(some(1), map(x => x + 1)) // some(2)
 * ```
 */
export const some = <A>(a: A): Option<A> => ({ _tag: 'Some', value: a });

/**
 * isNone :: `Option<a> -> boolean`
 *
 * isNone :: `<A>(option: Option<A>) => option is None<A>`
 *
 * @param option `Option<a>`
 * @returns  `boolean`
 *
 * @example
 * ```ts
 * pipe(some(1), isNone) // false
 * pipe(none, isNone) // true
 * ```
 */
export const isNone = <A>(option: Option<A>): option is Option.None<A> => option._tag === 'None';

/**
 * isSome :: `Option<a> -> boolean`
 *
 * isSome :: `<A>(option: Option<A>) => option is Some<A>`
 *
 * @param option `Option<a>`
 * @returns  `boolean`
 *
 * @example
 * ```ts
 * pipe(some(1), isSome) // true
 * pipe(none, isSome) // false
 * ```
 */
export const isSome = <A>(option: Option<A>): option is Option.Some<A> => option._tag === 'Some';

/**
 * fromNullable :: `a | null | undefined -> Option<a>`
 *
 * fromNullable :: `<A>(a: A | null | undefined) => Option<A>`
 *
 * @param a `a | null | undefined`
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe(1, fromNullable) // some(1)
 * pipe(null, fromNullable) // none
 * pipe(undefined, fromNullable) // none
 * ```
 */
export const fromNullable = <A>(a: A | null | undefined): Option<A> => (a == null ? none() : some(a));

/**
 * fromPredicate :: `(a -> boolean) -> a -> Option<a>`
 *
 * fromPredicate :: `<A>(predicate: (a: A) => boolean) => (a: A) => Option<A>`
 *
 * @param predicate `(a -> boolean)`
 * @returns `a -> Option<a>`
 *
 * @example
 * ```ts
 * pipe(1, fromPredicate(x => x > 1)) // none
 * pipe(2, fromPredicate(x => x > 1)) // some(2)
 * ```
 */
export const fromPredicate =
  <A>(predicate: (a: A) => boolean) =>
  (a: A): Option<A> =>
    predicate(a) ? some(a) : none();

/**
 * fromIterable :: `Iterable<a> -> Option<a>`
 *
 * fromIterable :: `<A>(iterable: Iterable<A>) => Option<A>`
 *
 * @param iterable `Iterable<a>`
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe([1, 2, 3], fromIterable) // some(1)
 * pipe([], fromIterable) // none
 * ```
 */
export const fromIterable = <A>(iterable: Iterable<A>): Option<A> => {
  const iterator = iterable[Symbol.iterator]();
  const next = iterator.next();
  return next.done ? none() : some(next.value);
};

/**
 * toNullable :: `Option<a> -> a | null`
 *
 * toNullable :: `<A>(option: Option<A>) => A | null`
 *
 * @param option `Option<a>`
 * @returns `a | null`
 *
 * @example
 * ```ts
 * pipe(some(1), toNullable) // 1
 * pipe(none, toNullable) // null
 * ```
 */
export const toNullable = <A>(option: Option<A>): A | null => (isNone(option) ? null : option.value);

/**
 * toUndefined :: `Option<a> -> a | undefined`
 *
 * toUndefined :: `<A>(option: Option<A>) => A | undefined`
 *
 * @param option `Option<a>`
 * @returns `a | undefined`
 *
 * @example
 * ```ts
 * pipe(some(1), toUndefined) // 1
 * pipe(none, toUndefined) // undefined
 * ```
 */
export const toUndefined = <A>(option: Option<A>): A | undefined => (isNone(option) ? undefined : option.value);

export const None: tNone.None<TOption> = {
  none,
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
  orElse: fb => fa => (isSome(fa) ? fa : fb()),
};

export const Foldable: tFoldable.Foldable<TOption> = {
  reduce: (f, b) => fa => (isSome(fa) ? f(b, fa.value) : b),
};

export const Filterable: tFilterable.Filterable<TOption> = {
  ...None,
  ...Functor,
  filterMap: f => fa => (isSome(fa) ? f(fa.value) : none()),
};

export const Applicative: tApplicative.Applicative<TOption> = {
  ...Of,
  ...Functor,
  ap: fa => fab => (isSome(fab) ? pipe(fa, Functor.map(fab.value)) : none()),
};

export const Alternative: tAlternative.Alternative<TOption> = {
  ...None,
  ...Applicative,
  ...SemiAlternative,
};

export const Monad: tMonad.Monad<TOption> = {
  ...Applicative,
  flatMap: f => fa => (isSome(fa) ? f(fa.value) : none()),
};

export const SemiAlign: tSemiAlign.SemiAlign<TOption> = {
  zipWith: f => fa => fb => (isSome(fa) && isSome(fb) ? some(f(fa.value, fb.value)) : none()),
};

export const match =
  <A, B, C>(onSome: (a: A) => B, onNone: () => C) =>
  (fa: Option<A>): B | C =>
    isSome(fa) ? onSome(fa.value) : onNone();

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
 * orElse :: `(() -> Option<a>) -> Option<a> -> Option<a>`
 *
 * orElse :: `<A>(fb: () => Option<A>) => (fa: Option<A>) => Option<A>`
 *
 * @param fb `() -> Option<a>`
 * @returns `Option<a> -> Option<a>`
 *
 * @example
 * ```ts
 * pipe(some(1), orElse(() => some(2))) // some(1)
 * pipe(some(1), orElse(() => none)) // some(1)
 * pipe(none, orElse(() => some(2))) // some(2)
 * pipe(none, orElse(() => none)) // none
 * ```
 */
export const orElse = SemiAlternative.orElse;

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
export const or = tSemiAlternative.or(SemiAlternative);

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
 * tap :: `(a -> void) -> Option<a> -> Option<a>`
 *
 * tap :: `<A>(f: (a: A) => void) => (fa: Option<A>) => Option<A>`
 *
 * @param f `(a -> void)`
 * @returns `Option<a> -> Option<a>`
 *
 * @example
 * ```ts
 * pipe(some(1), tap(console.log)) // some(1)
 * pipe(none, tap(console.log)) // none
 * ```
 */
export const tap = tfunctor.tap(Functor);

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
 * liftA2 :: `(a b -> c) -> Option<a> -> Option<b> -> Option<c>`
 *
 * liftA2 :: `<A, B, C>(f: (a: A, b: B) => C) => (fa: Option<A>) => (fb: Option<B>) => Option<C>`
 *
 * @param f `(a b -> c)`
 * @returns `Option<a> -> Option<b> -> Option<c>`
 *
 * @example
 * ```ts
 * pipe(liftA2((a, b) => a + b)(some(1))(some(2))) // some(3)
 * pipe(liftA2((a, b) => a + b)(some(1))(none())) // none()
 * pipe(liftA2((a, b) => a + b)(none())(some(2))) // none()
 * pipe(liftA2((a, b) => a + b)(none())(none())) // none()
 * ```
 */
export const liftA2 = tApplicative.liftA2(Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

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
 * alias for {@link flatMap}
 */
export const andThen = flatMap;

/**
 * alias for {@link flatMap}
 */
export const chain = flatMap;

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

export const zipWith = SemiAlign.zipWith;

export const zip = tSemiAlign.zip(SemiAlign);
