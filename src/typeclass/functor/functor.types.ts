import { HKT, $ } from '@kinds';
import { Dec } from '@utils/numbers';
import { SplitAt } from '@utils/tuples';

export interface FunctorParams<F extends HKT, A> extends HKT {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, [A, ...this['rawArgs']]>] : never;
}

export interface FunctorResult<F extends HKT, B> extends HKT {
  return: this['rawArgs'] extends unknown[] ? $<F, [B, ...this['rawArgs']]> : never;
}

export interface FunctorCompositionParams<F extends HKT, G extends HKT, A> extends HKT {
  return: this['rawArgs'] extends unknown[]
    ? SplitAt<Dec<F['arity']>, this['rawArgs']> extends [infer FB extends unknown[], infer GB extends unknown[]]
      ? [fa: $<F, [$<G, [A, ...GB]>, ...FB]>]
      : never
    : never;
}

export interface FunctorCompositionResult<F extends HKT, G extends HKT, B> extends HKT {
  return: this['rawArgs'] extends unknown[]
    ? SplitAt<Dec<F['arity']>, this['rawArgs']> extends [infer FB extends unknown[], infer GB extends unknown[]]
      ? $<F, [$<G, [B, ...GB]>, ...FB]>
      : never
    : never;
}

export interface FlapParams<F extends HKT, A> extends HKT {
  return: this['rawArgs'] extends [infer B, ...infer Rest] ? [fab: $<F, [(a: A) => B, ...Rest]>] : never;
}

export interface FlapResult<F extends HKT> extends HKT {
  return: this['rawArgs'] extends unknown[] ? $<F, [...this['rawArgs']]> : never;
}

export interface FunctorAsParams<F extends HKT> extends HKT {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, this['rawArgs']>] : never;
}

export interface FunctorAsResult<F extends HKT, B> extends HKT {
  return: this['rawArgs'] extends [any, ...infer Args] ? $<F, [B, ...Args]> : never;
}
