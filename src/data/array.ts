import { Kind } from "@kinds";
import * as tfunctor from "@typeclass/functor";
import { type Of as tOf } from "@typeclass/of";
import * as tTo from "@typeclass/to";

export type TArray = Kind.Array;

export const Of: tOf<TArray> = {
  of: (a) => [a],
};

export const To: tTo.To<TArray> = {
  getOrElse: (f) => (fa) => (fa.length === 0 ? f() : fa[0]),
};

export const Functor: tfunctor.Functor<Kind.Array> = {
  map: (f) => (fa) => fa.map(f),
};

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
