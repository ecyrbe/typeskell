import type { Kind, $ } from "@kinds";
import { GenericFn } from "@utils/functions";
import { Dec } from "@utils/numbers";

export interface ToParams<F extends Kind, A> extends Kind {
  return: this["rawArgs"] extends unknown[]
    ? [fa: $<F, [A, ...this["rawArgs"]]>]
    : never;
}

export interface ToResult<A> extends Kind {
  return: A;
}

export interface To<F extends Kind> {
  /**
   * to :: F a -> a
   *
   * to :: <A,...>(fa: $<F, [A,...]>) => A
   *
   * @param fa : F a
   * @returns a
   *
   */
  getOrElse: <A>(
    f: () => A
  ) => GenericFn<Dec<F["arity"]>, ToParams<F, A>, ToResult<A>>;
}
