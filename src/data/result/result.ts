import type { Kind, InvariantParam, CovariantParam } from '@kinds';
import type { Expect, Equal } from 'type-testing';
import * as tFunctor from '@typeclass/functor';
import * as tbifunctor from '@typeclass/bifunctor';
import * as tOf from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tFlip from '@typeclass/flip';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import * as tFoldable from '@typeclass/foldable';
import * as tTraversable from '@typeclass/traversable';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tSemiAlign from '@typeclass/semialign';
import * as O from '../option';
import { pipe } from '@utils/pipe';
import { Result, Err, Ok } from './result.types';

export const err = <E, A = never>(e: E): Result<A, E> => ({ _tag: 'Err', err: e });
export const ok = <A, E = never>(a: A): Result<A, E> => ({ _tag: 'Ok', ok: a });

export const isErr = <A, E>(result: Result<A, E>): result is Err<A, E> => result._tag === 'Err';

export const isOk = <A, E>(result: Result<A, E>): result is Ok<A, E> => result._tag === 'Ok';

export interface TResult extends Kind<[InvariantParam, CovariantParam]> {
  return: Result<this['arg0'], this['arg1']>;
}

export const Of: tOf.Of<TResult> = {
  of: ok,
};

export const To: tTo.To<TResult> = {
  getOrElse: f => fa => (isOk(fa) ? fa.ok : f(fa.err)),
};

export const OptionalTo: tTo.OptionalTo<TResult> = {
  ...To,
  get: fa => (isOk(fa) ? O.some(fa.ok) : O.none()),
};

export const Flip: tFlip.Flip<TResult> = {
  flip: fa => (isOk(fa) ? err(fa.ok) : ok(fa.err)),
};

export const Bifunctor: tbifunctor.BiFunctor<TResult> = {
  bimap: (f, g) => fa => (isOk(fa) ? ok(f(fa.ok)) : err(g(fa.err))),
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TResult> = {
  ...Of,
  ...Bifunctor,
  biFlatMap: (f, g) => fa => (isOk(fa) ? f(fa.ok) : g(fa.err)),
};

export const Functor: tFunctor.Functor<TResult> = {
  map: tbifunctor.mapLeft(Bifunctor),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TResult> = {
  ...Functor,
  orElse: fb => fa => (isOk(fa) ? ok(fa.ok) : fb()),
};

export const Foldable: tFoldable.Foldable<TResult> = {
  reduce: (f, b) => fa => (isOk(fa) ? f(b, fa.ok) : b),
};

export const Applicative: tApplicative.Applicative<TResult> = {
  ...Of,
  ...Functor,
  ap: fa => fab => (isOk(fab) ? pipe(fa, Functor.map(fab.ok)) : err(fab.err)),
};

export const Monad: tMonad.Monad<TResult> = {
  ...Applicative,
  flatMap: f => fa => (isOk(fa) ? f(fa.ok) : err(fa.err)),
};

const traverseImpl: (
  applicative: tApplicative.Applicative<Kind.F>,
) => tTraversable.Traversable.$traverse<TResult, Kind.F> = applicative => f => fa =>
  isErr(fa) ? applicative.of(err(fa.err)) : pipe(f(fa.ok), applicative.map(ok));

export const Traversable: tTraversable.Traversable<TResult> = {
  ...Functor,
  ...Foldable,
  traverse: traverseImpl as any,
};

type TraverseTestCases = [Expect<Equal<typeof traverseImpl, typeof Traversable.traverse<Kind.F>>>];

export const SemiAlign: tSemiAlign.SemiAlign<TResult> = {
  zipWith: f => fa => fb => (isOk(fa) ? (isOk(fb) ? ok(f(fa.ok, fb.ok)) : err(fb.err)) : err(fa.err)),
};

export const match =
  <A, B, C, E>(onOk: (a: A) => B, onErr: (e: E) => C) =>
  (result: Result<A, E>): B | C =>
    isOk(result) ? onOk(result.ok) : onErr(result.err);

/**
 * of :: `a -> Result<a, never>`
 *
 * of :: `<A>(a: A) => Result<A, never>`
 *
 * @param a any value
 * @returns `Result<a, never>`
 *
 * @example
 * ```ts
 * pipe(1, of) // ok(1)
 * ```
 */
export const of = Of.of;

/**
 * getOrElse :: `(e -> b) -> Result<a, e> -> a | b`
 *
 * getOrElse :: `<A, B>(f: (e: E) => B) => (fa: Result<A, E>) => A | B`
 *
 * @param f `e -> b`
 * @returns `Result<a, e> -> a | b`
 *
 * @example
 * ```ts
 * pipe(ok(0), getOrElse(() => 1)) // 0
 * pipe(err("error"), getOrElse(() => 1)) // 1
 * ```
 */
export const getOrElse = To.getOrElse;

/**
 * getOr :: `b -> Result<a, e> -> a | b`
 *
 * getOr :: `<B>(b: B) => <A,E>(fa: Result<A, E>) => A | B`
 *
 * @param b `b`
 * @returns `Result<a, e> -> a | b`
 *
 * @example
 * ```ts
 * pipe(ok(0), getOr(1)) // 0
 * pipe(err("error"), getOr(1)) // 1
 * ```
 */
export const getOr = tTo.getOr(To);

/**
 * flip :: `Result<a, e> -> Result<e, a>`
 *
 * @param fa `Result<a, e>`
 * @returns `Result<e, a>`
 *
 * @example
 * ```ts
 * pipe(ok(0), flip) // err(0)
 * pipe(err("error"), flip) // ok("error")
 * ```
 */
export const flip = Flip.flip;

/**
 * get :: `Result<a, e> -> Option<a>`
 *
 * get :: `<A, E>(fa: Result<A, E>) => Option<A>`
 *
 * @param fa `Result<a, e>`
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe(ok(0), get) // some(0)
 * pipe(err("error"), get) // none
 * ```
 */
export const get = OptionalTo.get;

/**
 * alias of {@link get}
 *
 * toOption :: `Result<a, e> -> Option<a>`
 *
 * toOption :: `<A, E>(fa: Result<A, E>) => Option<A>`
 *
 * @param fa `Result<a, e>`
 * @returns `Option<a>`
 *
 * @example
 * ```ts
 * pipe(ok(0), toOption) // some(0)
 * pipe(err("error"), toOption) // none
 * ```
 */
export const toOption = get;

/**
 * fromOption :: `(() -> e ) -> Option<a> -> Result<a, e>`
 *
 * fromOption :: `<A, E>(onErr: () => E) => (option: O.Option<A>): Result<A, E>`
 *
 * @param onErr A function that returns an error of type `E`.
 * @returns A function that takes an `Option<A>` and returns a `Result<A, E>`.
 *
 * @example
 * ```ts
 * pipe(some(0), fromOption(() => "error")) // ok(0)
 * pipe(none(), fromOption(() => "error")) // err("error")
 * ```
 */
export const fromOption =
  <A, E>(onErr: () => E) =>
  (option: O.Option<A>): Result<A, E> =>
    O.isNone(option) ? err(onErr()) : ok(option.value);

/**
 * fromNullable :: `(() -> e) -> a | null | undefined -> Result<a, e>`
 *
 * fromNullable :: `<A, E>(onErr: () => E) => (a: A | null | undefined) => Result<A, E>`
 *
 * @param onErr A function that returns an error of type `E`.
 * @returns A function that takes a value of type `A | null | undefined` and returns a `Result<A, E>`.
 *
 * @example
 * ```ts
 * pipe(0, fromNullable(() => "error")) // ok(0)
 * pipe(null, fromNullable(() => "error")) // err("error")
 * pipe(undefined, fromNullable(() => "error")) // err("error")
 * ```
 */
export const fromNullable =
  <A, E>(onErr: () => E) =>
  (a: A | null | undefined): Result<A, E> =>
    a == null ? err(onErr()) : ok(a);

/**
 * fromPredicate :: `(a -> boolean) (a -> e) -> a -> Result<a, e>`
 *
 * fromPredicate :: `<A, E>(predicate: (a: A) => boolean, onErr: (a: A) => E) => (a: A) => Result<A, E>`
 *
 * @param predicate A function that takes a value of type `A` and returns a boolean.
 * @param onErr A function that takes a value of type `A` and returns an error of type `E`.
 * @returns A function that takes a value of type `A` and returns a `Result<A, E>`.
 *
 * @example
 * ```ts
 * pipe(0, fromPredicate(x => x === 0, () => "error")) // ok(0)
 * pipe(1, fromPredicate(x => x === 0, () => "error")) // err("error")
 * ```
 */
export const fromPredicate =
  <A, E>(predicate: (a: A) => boolean, onErr: (a: A) => E) =>
  (a: A): Result<A, E> =>
    predicate(a) ? ok(a) : err(onErr(a));

/**
 * orElse :: `(e1 -> Result<a, e2>) -> Result<a, e1> -> Result<a, e2>`
 *
 * orElse :: `<A, E1, E2>(f: (e: E1) => Result<A, E2>) => (fa: Result<A, E1>) => Result<A, E2>`
 *
 * @param f `e1 -> Result<a, e2>`
 * @returns `Result<a, e1> -> Result<a, e2>`
 *
 * @example
 * ```ts
 * pipe(ok(0), orElse(() => ok(1))) // ok(0)
 * pipe(err("error"), orElse(() => ok(1))) // ok(1)
 * pipe(err("error"), orElse((e) => err(`${e}!`))) // err("error!")
 * ```
 */
export const orElse = tBiFlatMap.orElse(BiFlatMap);

/**
 * less strict version of {@link orElse}
 *
 * orElseW :: `(e1 -> Result<a2, e2>) -> Result<a1, e1> -> Result<a1 | a2, e2>`
 *
 * @param f `(e1 -> Result<a2, e2>)`
 * @returns `Result<a1, e1> -> Result<a1 | a2, e2>`
 *
 * @example
 * ```ts
 * pipe(ok(0), orElseW(() => ok(1))) // ok(0)
 * pipe(ok(0), orElseW(() => ok("hello"))) // ok(0)
 * pipe(err("error"), orElseW(() => ok(1))) // ok(1)
 * pipe(err("error"), orElseW(() => err("error!"))) // err("error!")
 * ```
 */
export const orElseW: <E1, E2, A2>(f: (e: E1) => Result<A2, E2>) => <A1>(fa: Result<A1, E1>) => Result<A1 | A2, E2> =
  f => fa => (isOk(fa) ? ok(fa.ok) : f(fa.err));

/**
 * Alternative version of orElse
 *
 * orElseAlt :: `(() -> Result<a, e1>) -> Result<a, e2> -> Result<a, e1>`
 *
 * orElseAlt :: `<A, E1>(fb: () => Result<A, E1>) => <E2>(fa: Result<A, E2>) => Result<A, E1>`
 *
 * @param fb `() -> Result<a, e1>`
 * @returns `Result<a, e2> -> Result<a, e1>`
 *
 * @example
 * ```ts
 * pipe(ok(0), orElseAlt(() => ok(1))) // ok(0)
 * pipe(err("error"), orElseAlt(() => ok(1))) // ok(1)
 * pipe(err("error"), orElseAlt(() => err("error!"))) // err("error!")
 * ```
 */
export const orElseAlt = SemiAlternative.orElse;

/**
 *  or :: `Result<a, e1> -> Result<a, e2> -> Result<a, e1>`
 *
 * or :: `<A, E1>(fb: Result<A, E1>) => <E2>(fa: Result<A, E2>) => Result<A, E1>`
 *
 * @param fb `Result<a, e1>`
 * @returns `Result<a, e2> -> Result<a, e1>`
 *
 * @example
 * ```ts
 * pipe(ok(0), or(ok(1))) // ok(0)
 * pipe(err("error"), or(ok(1))) // ok(1)
 * pipe(err("error"), or(err("error!"))) // err("error!")
 * ```
 */
export const or = tSemiAlternative.or(SemiAlternative);

/**
 * map :: `(a -> b) -> Result<a, e> -> Result<b, e>`
 *
 * map :: `<A, B>(f: (a: A) => B) => <E>(fa: Result<A, E>) => Result<B, E>`
 *
 * @param f `a -> b`
 * @returns `Result<a, e> -> Result<b, e>`
 *
 * @example
 * ```ts
 * pipe(ok(0), map(x => x + 1)) // ok(1)
 * pipe(err("error"), map(x => x + 1)) // err("error")
 * ```
 */
export const map = Functor.map;

/**
 * reduce :: `(b a -> b) b -> Result<a, e> -> b`
 *
 * reduce :: `<A, B>(f: (b: B, a: A) => B, b: B) => <E>(fa: Result<A, E>) => B`
 *
 * @param f `(b a -> b) b`
 * @param b `b`
 * @returns `Result<a, e> -> b`
 *
 * @example
 * ```ts
 * pipe(ok(0), reduce((b, a) => b + a, 0)) // 0
 * pipe(err("error"), reduce((b, a) => b + a, 0)) // 0
 * ```
 */
export const reduce = Foldable.reduce;

/**
 * flap :: `a -> Result<(a -> b), e> -> Result<b, e>`
 *
 * flap :: `<A>(a: A) => <B, E>(fab: Result<(a: A) => B, E>) => Result<B, E>`
 *
 * @param a `a`
 * @returns `Result<(a -> b), e> -> Result<b, e>`
 *
 * @example
 * ```ts
 * pipe(ok(x => x + 1), flap(0)) // ok(1)
 * pipe(err("error"), flap(0)) // err("error")
 * ```
 */
export const flap = tFunctor.flap(Functor);

/**
 * as :: `b -> Result<a, e> -> Result<b, e>`
 *
 * as :: `<B>(b: B) => <A,E>(fa: Result<A, E>) => Result<B, E>`
 *
 * @param b `b`
 * @returns `Result<a, e> -> Result<b, e>`
 *
 * @example
 * ```ts
 * pipe(ok(0), as(1)) // ok(1)
 * pipe(err("error"), as(1)) // err("error")
 * ```
 */
export const as = tFunctor.as(Functor);

/**
 * tap :: `(a -> void) -> Result<a, e> -> Result<a, e>`
 *
 * tap :: `<A>(f: (a: A) => void) => <E>(fa: Result<A, E>) => Result<A, E>`
 *
 * @param f `(a -> void)`
 * @returns `Result<a, e> -> Result<a, e>`
 *
 * @example
 * ```ts
 * pipe(ok(0), tap(x => console.log(x))) // ok(0)
 * pipe(err("error"), tap(x => console.log(x))) // err("error")
 * ```
 */
export const tap = tFunctor.tap(Functor);

/**
 * doubleMap :: `(a -> b) -> Result<Result<a, e1>, e2> -> Result<Result<b, e1>, e2>`
 *
 * doubleMap :: `<A, B>(f: (a: A) => B) => <E1, E2>(fa: Result<Result<A, E1>, E2>) => Result<Result<B, E1>, E2>`
 *
 * @param f `a -> b`
 * @returns `Result<Result<a, e1>, e2> -> Result<Result<b, e1>, e2>`
 *
 * @example
 * ```ts
 * pipe(ok(ok(0)), doubleMap(x => x + 1)) // ok(ok(1))
 * pipe(err("error"), doubleMap(x => x + 1)) // err("error")
 * ```
 */
export const doubleMap = tFunctor.mapCompose(Functor, Functor);

/**
 * bimap :: `(a -> b) (e1 -> e2) -> Result<a, e1> -> Result<b, e2>`
 *
 * bimap :: `<A, B, E1, E2>(f: (a: A) => B, g: (e: E1) => E2) => (fa: Result<A, E1>) => Result<B, E2>`
 *
 * @param f `a -> b`
 * @param g `e1 -> e2`
 * @returns `Result<a, e1> -> Result<b, e2>`
 *
 * @example
 * ```ts
 * pipe(ok(0), bimap(x => x + 1, x => x + "!")) // ok(1)
 * pipe(err("error"), bimap(x => x + 1, x => x + "!")) // err("error!")
 * ```
 */
export const bimap = Bifunctor.bimap;

export const bitap = tbifunctor.bitap(Bifunctor);

export const mapLeft = tbifunctor.mapLeft(Bifunctor);

export const mapRight = tbifunctor.mapRight(Bifunctor);

export const tapLeft = tbifunctor.tapLeft(Bifunctor);

export const tapRight = tbifunctor.tapRight(Bifunctor);

export const tapErr = tapRight;

/**
 * mapErr :: `(e1 -> e2) -> Result<a, e1> -> Result<a, e2>`
 *
 * mapErr :: `<E1, E2>(f: (e: E1) => E2) => <A>(fa: Result<A, E1>) => Result<A, E2>`
 *
 * @param f `e1 -> e2`
 * @returns `Result<a, e1> -> Result<a, e2>`
 *
 * @example
 * ```ts
 * pipe(ok(0), mapErr(x => x + "!")) // ok(0)
 * pipe(err("error"), mapErr(x => x + "!")) // err("error!")
 */
export const mapErr = mapRight;

/**
 * ap :: `Result<a, e1> -> Result<(a -> b), e2> -> Result<b, e1 | e2>`
 *
 * ap :: `<A, E1>(fa: Result<A, E1>) => <B, E2>(fab: Result<(a: A) => B, E2>) => Result<B, E1 | E2>`
 *
 * @param fa `Result<a, e1>`
 * @returns fab: `Result<(a -> b), e2> -> Result<b, e1 | e2>`
 *
 * @example
 * ```ts
 * pipe(of(x => x + 1), ap(ok(0))) // ok(1)
 * pipe(err("error"), ap(ok(0))) // err("error")
 * pipe(of(x => x + 1), ap(err("error"))) // err("error")
 * ```
 */
export const ap = Applicative.ap;

export const liftA2 = tApplicative.liftA2(Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

/**
 * flatMap :: `(a -> Result<b, e1>) -> Result<a, e2> -> Result<b, e1 | e2>`
 *
 * flatMap :: `<A, B, E1>(f: (a: A) => Result<B, E1>) => <E2>(fa: Result<A, E2>) => Result<B, E1 | E2>`
 *
 * @param f `a -> Result<b, e1>`
 * @returns `Result<a, e2> -> Result<b, e1 | e2>`
 *
 * @example
 * ```ts
 * pipe(ok(5), flatMap(x => ok(x + 1))) // ok(6)
 * pipe(err("error"), flatMap(x => ok(x + 1))) // err("error")
 * pipe(ok(5), flatMap(x => err("error"))) // err("error")
 * ```
 */
export const flatMap = Monad.flatMap;

/**
 * alias for {@link flatMap}
 */
export const andThen = flatMap;

/**
 * alias of {@link flatMap}
 */
export const chain = flatMap;

/**
 * flatten :: `Result<Result<a, e1>, e2> -> Result<a, e1 | e2>`
 *
 * flatten :: `<A, E1, E2>(ffa: Result<Result<A, E1>, E2>) => Result<A, E1 | E2>`
 *
 * @param ffa `Result<Result<a, e1>, e2>`
 * @returns `Result<a, e1 | e2>`
 *
 * @example
 * ```ts
 * pipe(ok(ok(0)), flatten) // ok(0)
 * pipe(ok(err("error")), flatten) // err("error")
 * pipe(err("error"), flatten) // err("error")
 * ```
 */
export const flatten = tMonad.flatten(Monad);

/**
 * biFlapMap :: `(a -> Result<b, e2>) (e1 -> Result<b, e2>) -> Result<a, e1> -> Result<b, e2>`
 *
 * biFlapMap :: `<A, B, E1, E2>(f: (a: A) => Result<B, E2>, g: (e: E1) => Result<B, E2>) => (fa: Result<A, E1>) => Result<B, E2>`
 *
 * @param f `a -> Result<b, e2>`
 * @param g `e1 -> Result<b, e2>`
 * @returns `Result<a, e1> -> Result<b, e2>`
 *
 * @example
 * ```ts
 * pipe(ok(0), biFlapMap(x => ok(x + 1), x => err("error"))) // ok(1)
 * pipe(err("error"), biFlapMap(x => ok(x + 1), x => err("error!"))) // err("error!")
 * ```
 */
export const biFlatMap = BiFlatMap.biFlatMap;

/**
 * traverse :: `Applicative f => (a -> f b) -> Result<a, e> -> f Result<b, e>`
 *
 * traverse :: `<F extends Kind>(applicative: Applicative<F>) => <A, B>(f: (a: A) => $<F, [B]>) => <E>(fa: Result<A, E>) => $<F, [Result<B, E>]>
 *
 * @param applicative `Applicative<F>`
 * @returns `(a -> f b) -> Result<a, e> -> f Result<b, e>`
 *
 * @example
 * ```ts
 * const traverseOption = traverse(O.Applicative);
 * pipe(ok(0), traverseOption(x => some(x + 1))) // some(ok(1))
 * pipe(err("error"), traverseOption(x => some(x + 1))) // some(err("error"))
 * pipe(ok(0), traverseOption(x => none)) // none
 * ```
 */
export const traverse: <F extends Kind>(
  F: tApplicative.Applicative<F>,
) => tTraversable.Traversable.$traverse<TResult, F> = Traversable.traverse;

/**
 * sequence :: `Applicative f => Result<f a, e> -> f Result<a, e>`
 *
 * sequence :: `<F extends Kind>(applicative: Applicative<F>) => <A, E>(fa: Result<$<F, [A]>, E>) => $<F, [Result<A, E>]>
 *
 * @param applicative `Applicative<F>`
 * @returns `Result<f a, e> -> f Result<a, e>`
 *
 * @example
 * ```ts
 * const sequenceOption = sequence(O.Applicative);
 * pipe(ok(some(0)), sequenceOption) // some(ok(0))
 * pipe(ok(none), sequenceOption) // none
 * pipe(err("error"), sequenceOption) // some(err("error"))
 * ```
 */
export const sequence: <F extends Kind>(
  F: tApplicative.Applicative<F>,
) => tTraversable.Traversable.$sequence<TResult, F> = tTraversable.sequence(Traversable);

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);

export const zipWith = SemiAlign.zipWith;

export const zip = tSemiAlign.zip(SemiAlign);
