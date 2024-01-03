import type { HKT, $ } from '@kinds';
import { GenericFn } from '@utils/functions';

export interface ZeroParams extends HKT {
  return: [];
}

export interface ZeroResult<F extends HKT> extends HKT {
  return: this['rawArgs'] extends unknown[] ? $<F, this['rawArgs']> : never;
}

export interface Zero<F extends HKT> {
  /**
   * zero :: `() -> F a`
   *
   * zero :: `<A,...>() => $<F, [A,...]>`
   *
   * @returns `F a`
   */
  zero: GenericFn<F['arity'], ZeroParams, ZeroResult<F>>;
}
