import type { Kind, $ } from "@kinds";
import { GenericFn } from "@utils/functions";
import { Inc } from "@utils/numbers";

export interface ToParams extends Kind {
  return: this["rawArgs"] extends [infer B, any, ...infer Args]
    ? [f: (...args: Args) => B]
    : never;
}

export interface ToResult<F extends Kind> extends Kind {
  return: this["rawArgs"] extends [infer B, infer A, ...infer Args]
    ? (fa: $<F, [A, ...Args]>) => A | B
    : never;
}

/**
 * To is a typeclass that provides a way to extract a value from a type.
 */
export interface To<F extends Kind> {
  /**
   * to :: f (e -> b) -> F a -> a | b
   *
   * to :: <A, B,...E>(f: (...args: E)=> B) => (fa: $<F, [A,...E]>) => A | B
   *
   * @param f : f (e -> a)
   * @returns F a -> a
   *
   */
  getOrElse: GenericFn<Inc<F["arity"]>, ToParams, ToResult<F>>;
}
