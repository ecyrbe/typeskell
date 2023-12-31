import type { Kind, $ } from "@kinds";
import { GenericFn } from "@utils/functions";
import { Inc } from "@utils/numbers";

export interface ToParams extends Kind {
  return: this["rawArgs"] extends [infer B, ...infer Args]
    ? [f: (...args: Args) => B]
    : never;
}

export interface ToResult<F extends Kind> extends Kind {
  return: this["rawArgs"] extends [infer B, ...infer Args]
    ? <A>(fa: $<F, [A, ...Args]>) => A | B
    : never;
}

/**
 * To is a typeclass that provides a way to extract a value from a type.
 */
export interface To<F extends Kind> {
  /**
   * to :: f (e -> b) -> F a -> a | b
   *
   * to :: <B,...E>(f: (...args: E)=> B) => <A>(fa: $<F, [A,...E]>) => A | B
   *
   * @param f : f (e -> a)
   * @returns F a -> a
   *
   */
  getOrElse: GenericFn<F["arity"], ToParams, ToResult<F>>;
}

export interface GetOrParams<F extends Kind> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? [fa: $<F, this["rawArgs"]>]
    : never;
}

export interface GetOrResult<B> extends Kind {
  return: this["arg0"] | B;
}

/**
 * getOr :: b -> F a -> a | b
 *
 * getOr :: <F>(to: To<F>) => <B>(b: B) => <A,...>(fa: $<F, [A,...]>) => A | B
 *
 * @param to : To<F>
 * @param b : b
 * @returns F a -> a | b
 */
export const getOr =
  <F extends Kind>(to: To<F>) =>
  <B>(b: B): GenericFn<F["arity"], GetOrParams<F>, GetOrResult<B>> =>
    // @ts-expect-error
    to.getOrElse(() => b);
