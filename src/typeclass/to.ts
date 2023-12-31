import type { Kind, $ } from "@kinds";
import { GenericFn } from "@utils/functions";
import { Dec } from "@utils/numbers";

export interface ToParams extends Kind {
  return: this["rawArgs"] extends [infer A, ...infer Args]
    ? [f: (...args: Args) => A]
    : never;
}

export interface ToResult<F extends Kind> extends Kind {
  return: this["rawArgs"] extends [infer A, ...infer Args]
    ? (fa: $<F, [A, ...Args]>) => A
    : never;
}

export interface To<F extends Kind> {
  /**
   * to :: f (e -> a) -> F a -> a
   *
   * to :: <A,...E>(f: (...args: E)=> A) => (fa: $<F, [A,...E]>) => A
   *
   * @param f : f (e -> a)
   * @returns F a -> a
   *
   */
  getOrElse: GenericFn<F["arity"], ToParams, ToResult<F>>;
}
