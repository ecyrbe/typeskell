import type { Expect, Equal } from 'type-testing';
import type { HKT, $ } from '@kinds';
import { GenericFn } from '@utils/functions';

export interface ToParams extends HKT {
  return: this['rawArgs'] extends [infer B, ...infer Args] ? [f: (...args: Args) => B] : never;
}

export interface ToResult<F extends HKT> extends HKT {
  return: this['rawArgs'] extends [infer B, ...infer Args] ? <A>(fa: $<F, [A, ...Args]>) => A | B : never;
}

/**
 * To is a typeclass that provides a way to extract a value from a type.
 */
export interface To<F extends HKT> {
  /**
   * to :: `(e -> b) -> F a -> a | b`
   *
   * to :: `<B,...E>(f: (...args: E)=> B) => <A>(fa: $<F, [A,...E]>) => A | B`
   *
   * @param f `f (e -> a)`
   * @returns `F a -> a`
   *
   */
  getOrElse: GenericFn<F['arity'], ToParams, ToResult<F>>;
}

export interface GetOrParams<F extends HKT> extends HKT {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, this['rawArgs']>] : never;
}

export interface GetOrResult<B> extends HKT {
  return: this['arg0'] | B;
}

const _getOr =
  (to: To<HKT.F>) =>
  <B>(b: B) =>
    to.getOrElse(() => b);

/**
 * getOr :: `To F -> b -> F a -> a | b`
 *
 * getOr :: `<F>(to: To<F>) => <B>(b: B) => <A,...>(fa: $<F, [A,...]>) => A | B`
 *
 * @param to `To F`
 * @param b `b`
 * @returns `F a -> a | b`
 */
export const getOr: <F extends HKT>(to: To<F>) => <B>(b: B) => GenericFn<F['arity'], GetOrParams<F>, GetOrResult<B>> =
  _getOr as any;

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [Expect<Equal<typeof getOr<HKT.F>, typeof _getOr>>];
