import { Kind } from "@kinds";
import { InvariantParam } from "../kinds/variance";
import * as tfunctor from "@typeclass/functor";
import * as tOf from "@typeclass/of";
import * as tTo from "@typeclass/to";

export interface None {
  readonly _tag: "None";
}

export interface Some<A> {
  readonly _tag: "Some";
  readonly value: A;
}

export type Option<A> = None | Some<A>;

export const none: Option<never> = { _tag: "None" };
export const some = <A>(a: A): Option<A> => ({ _tag: "Some", value: a });

export const isNone = <A>(option: Option<A>): option is None =>
  option._tag === "None";

export const isSome = <A>(option: Option<A>): option is Some<A> =>
  option._tag === "Some";

export interface TOption extends Kind<[InvariantParam]> {
  return: Option<this["arg0"]>;
}

export const Of: tOf.Of<TOption> = {
  of: some,
};

export const To: tTo.To<TOption> = {
  getOrElse: (f) => (fa) => (isSome(fa) ? fa.value : f()),
};

export const Functor: tfunctor.Functor<TOption> = {
  map: (f) => (fa) => (isSome(fa) ? some(f(fa.value)) : none),
};

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
 * doubleMap :: `(a -> b) -> Option<Option<a>> -> Option<Option<b>>`
 *
 * doubleMap :: `<A, B>(f: (a: A) => B) => (fa: Option<Option<A>>) => Option<Option<B>>`
 *
 * @param f `a -> b`
 * @returns `Option<Option<a>> -> Option<Option<b>>`
 */
export const doubleMap = tfunctor.mapCompose(Functor, Functor);
