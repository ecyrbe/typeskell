import { Kind } from "@kinds";
import * as tfunctor from "@typeclass/functor";

export type TArray = Kind.Array;

export const functor: tfunctor.Functor<Kind.Array> = {
  map: (f) => (fa) => fa.map(f),
};

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
export const map = functor.map;

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
export const flap = tfunctor.flap(functor);

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
export const doubleMap = tfunctor.mapComposition(functor, functor);
