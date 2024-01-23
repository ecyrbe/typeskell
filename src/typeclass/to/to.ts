import type { Expect, Equal } from 'type-testing';
import type { Kind, $ } from '@kinds';
import { GenericFn } from '@utils/functions';
import { TOption } from '@data/option';
import { TypeSkell } from '@typeskell';

export interface ToParams extends Kind {
  return: this['rawArgs'] extends [infer B, ...infer Args] ? [f: (...args: Args) => B] : never;
}

export interface ToResult<F extends Kind> extends Kind {
  return: this['rawArgs'] extends [infer B, ...infer Args] ? <A>(fa: $<F, [A, ...Args]>) => A | B : never;
}

/**
 * To is a typeclass that provides a way to extract a value from a type.
 */
export interface To<F extends Kind> {
  /**
   * to :: `(e -> b) -> F a -> a | b`
   *
   * to :: `<B,...E>(f: (...args: E)=> B) => <A>(fa: $<F, [A,...E]>) => A | B`
   *
   * At the moment typeskell don't support spreading outside a type constructor
   * So we have to use a workaround with a custom `ToParams` and `ToResult`
   *
   * @param f `f (e -> a)`
   * @returns `F a -> a`
   *
   */
  getOrElse: GenericFn<F['arity'], ToParams, ToResult<F>>;
}

export interface OptionalTo<F extends Kind> extends To<F> {
  get: TypeSkell<'F a ..e -> Option a', { F: F; Option: TOption }>;
}

const _getOr =
  (to: To<Kind.F>) =>
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
export const getOr: <F extends Kind>(to: To<F>) => TypeSkell<'b -> F a ..e -> Or a b', { F: F; Or: Kind.Or }> =
  _getOr as any;

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [Expect<Equal<typeof getOr<Kind.F>, typeof _getOr>>];
