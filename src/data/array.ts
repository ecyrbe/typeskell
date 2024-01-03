import { HKT } from '@kinds';
import * as tfunctor from '@typeclass/functor';
import { type Of as tOf } from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';

export type TArray = HKT.Array;

export const Zero: tZero.Zero<TArray> = {
  zero: () => [],
};

export const Of: tOf<TArray> = {
  of: a => [a],
};

export const To: tTo.To<TArray> = {
  getOrElse: f => fa => (fa.length === 0 ? f() : fa[0]),
};

export const Functor: tfunctor.Functor<TArray> = {
  map: f => fa => fa.map(f),
};

export const Applicative: tApplicative.Applicative<TArray> = {
  ...Of,
  ...Functor,
  ap: fa => fab => fab.flatMap(f => fa.map(f)),
};

/**
 * produce an empty array of type a
 *
 * zero :: `() -> a[]`
 *
 * zero :: `<A>() => A[]`
 *
 * @returns `a[]`
 *
 * @example
 * ```ts
 * pipe(zero(), map(x => x + 1)) // []
 * ```
 */
export const zero = Zero.zero;

/**
 * of :: a -> a[]
 * @param a : a
 * @returns fa: a[]
 *
 * @example
 * ```ts
 * pipe(1, of) // [1]
 * ```
 */
export const of = Of.of;

/**
 * getOrElse :: (() -> b) -> a[] -> a | b
 *
 * getOrElse :: `<B>(f: () => B) => <A>(fa: A[]) => A | B`
 *
 * @param f : () -> b
 * @returns fa: a[] -> a | b
 *
 * @example
 * ```ts
 * pipe([1], getOrElse(() => 0)) // 1
 * pipe([], getOrElse(() => 0)) // 0
 * ```
 */
export const getOrElse = To.getOrElse;

/**
 * getOr :: b -> a[] -> a | b
 *
 * getOr :: <B>(b: B) => <A>(fa: A[]) => A | B
 *
 * @param b : b
 * @returns fa: a[] -> a | b
 *
 * @example
 * ```ts
 * pipe([1], getOr(0)) // 1
 * pipe([], getOr(0)) // 0
 * ```
 */
export const getOr = tTo.getOr(To);

/**
 * map :: (a -> b) -> a[] -> b[]
 * @param f : a -> b
 * @returns fa: a[] -> b[]
 *
 * @example
 * ```ts
 * pipe([1,2,3], map(x => x + 1)) // [2,3,4]
 * ```
 */
export const map = Functor.map;

/**
 * flap :: a -> (a -> b)[] -> b[]
 * @param a : a
 * @returns fab: (a -> b)[] -> b[]
 *
 * @example
 * ```ts
 * pipe([x => x + 1, x => x*2], flap(2)) // [3, 4]
 * ```
 */
export const flap = tfunctor.flap(Functor);

/**
 * as :: b -> a[] -> b[]
 * @param b : b
 * @returns fa: a[] -> b[]
 *
 * @example
 * ```ts
 * pipe([1,2,3], as(0)) // [0,0,0]
 * ```
 */
export const as = tfunctor.as(Functor);

/**
 * doubleMap :: (a -> b) -> a[][] -> b[][]
 * @param f : a -> b
 * @returns fa: a[][] -> b[][]
 *
 * @example
 * ```ts
 * pipe([[1,2,3],[4,5,6]], doubleMap(x => x + 1)) // [[2,3,4],[5,6,7]]
 * ```
 */
export const doubleMap = tfunctor.mapCompose(Functor, Functor);

/**
 * ap :: a[] -> (a -> b)[] -> b[]
 *
 * ap :: <A, B>(fa: A[]) => (fab: (a: A) => B[]) => B[]
 *
 * @param fa : a[]
 * @returns fab: (a -> b)[] -> b[]
 *
 * @example
 * ```ts
 * pipe(of(x=>x+1), ap([1,2,3])) // [2,3,4]
 */
const ap = Applicative.ap;
