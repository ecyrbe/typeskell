import type { Kind, $ } from "@kinds";
import { GenericFn } from "@utils/functions";

export interface ZeroParams extends Kind {
  return: [];
}

export interface ZeroResult<F extends Kind> extends Kind {
  return: this["rawArgs"] extends unknown[] ? $<F, this["rawArgs"]> : never;
}

export interface Zero<F extends Kind> {
  /**
   * zero :: `() -> F a`
   *
   * zero :: `<A,...>() => $<F, [A,...]>`
   *
   * @returns `F a`
   */
  zero: GenericFn<F["arity"], ZeroParams, ZeroResult<F>>;
}
