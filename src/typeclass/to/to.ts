import type { Expect, Equal } from 'type-testing';
import type { Kind } from '@kinds';
import type { GenericFn } from '@utils/functions';
import type { TOption } from '@data/option/option.types';
import type { TypeSkell } from '@typeskell';
import type { ToParams, ToResult } from './to.types';

export namespace To {
  export type $getOrElse<F extends Kind> = GenericFn<F['arity'], ToParams, ToResult<F>>;
  export type $getOr<F extends Kind> = TypeSkell<'b -> F a ..e -> Or a b', { F: F; Or: Kind.Or }>;
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
  getOrElse: To.$getOrElse<F>;
}

const getOrImpl: (to: To<Kind.F>) => To.$getOr<Kind.F> = to => b => to.getOrElse(() => b);

/**
 * getOr :: `To F -> b -> F a -> a | b`
 *
 * getOr :: `<F>(to: To<F>) => <B>(b: B) => <A,...>(fa: $<F, [A,...]>) => A | B`
 *
 * @param to `To F`
 * @param b `b`
 * @returns `F a -> a | b`
 */
export const getOr: <F extends Kind>(to: To<F>) => To.$getOr<F> = getOrImpl as any;

export namespace OptionalTo {
  export type $get<F extends Kind> = TypeSkell<'F a ..e -> Option a', { F: F; Option: TOption }>;
}

export interface OptionalTo<F extends Kind> extends To<F> {
  get: OptionalTo.$get<F>;
}

/**
 * TYPE TESTS to check impl and interface are in sync
 */
type TestCases = [Expect<Equal<typeof getOr<Kind.F>, typeof getOrImpl>>];
