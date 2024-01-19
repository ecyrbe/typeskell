import { Kind, $ } from '@kinds';
import { Of } from '@typeclass/of';
import { TypeSkell } from '@typeskell';

/**
 * BiFlatMap is a typeclass that defines a single operation, biFlatMap.
 * It is a flatMap operation that allows you to recover from an error.
 */
export interface BiFlapMap<F extends Kind> extends Of<F> {
  biFlapMap: TypeSkell<'(a -> F b e ..x) (c -> F b e ..x) -> F a c ..y -> F b e ..xy', { F: F }>;
}

const orElseImpl: (
  biflatmap: BiFlapMap<Kind.F2>,
) => <A, E1, E2>(f: (e: E1) => $<Kind.F2, [A, E2]>) => (args_0: $<Kind.F2, [A, E1]>) => $<Kind.F2, [A, E2]> =
  biflatmap => f =>
    biflatmap.biFlapMap(biflatmap.of, f);

/**
 * orElse :: `BiFlatMap F => (e1 -> F a e2) -> F a e1 -> F a e2`
 *
 * @param biflatmap `BiFlatMap<F>`
 * @returns `(e1 -> F a e2) -> F a e1 -> F a e2`
 */
export const orElse: <F extends Kind>(
  biFlatMap: BiFlapMap<F>,
) => TypeSkell<'(a -> F _ b ..x) -> F _ a ..y -> F _ b ..xy ', { F: F }> = orElseImpl as any;
