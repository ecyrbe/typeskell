import type { Kind } from '@kinds';
import type { Of } from '@typeclass/of';
import type { TypeSkell } from '@typeskell';
import { orElse as orElseImpl } from './biflatmap.impl';
import { BiFunctor } from '@typeclass/bifunctor';

export namespace BiFlapMap {
  export type $biFlapMap<F extends Kind> = TypeSkell<
    '(a -> F b e ..x) (c -> F b e ..x) -> F a c ..y -> F b e ..xy',
    { F: F }
  >;
  export type $orElse<F extends Kind> = TypeSkell<'(a -> F _ b ..x) -> F _ a ..y -> F _ b ..xy ', { F: F }>;
}

/**
 * BiFlatMap is a typeclass that defines a single operation, biFlatMap.
 * It is a flatMap operation that allows you to recover from an error.
 */
export interface BiFlapMap<F extends Kind> extends Of<F>, BiFunctor<F> {
  biFlapMap: BiFlapMap.$biFlapMap<F>;
}

/**
 * orElse :: `BiFlatMap F => (e1 -> F a e2) -> F a e1 -> F a e2`
 *
 * @param biflatmap `BiFlatMap<F>`
 * @returns `(e1 -> F a e2) -> F a e1 -> F a e2`
 */
export const orElse: <F extends Kind>(biFlatMap: BiFlapMap<F>) => BiFlapMap.$orElse<F> = orElseImpl as any;
