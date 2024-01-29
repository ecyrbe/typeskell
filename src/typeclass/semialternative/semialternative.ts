import { Kind } from '@kinds';
import { TypeSkell } from '@typeskell';
import { Functor } from '@typeclass/functor';

export namespace SemiAlternative {
  export type $or<F extends Kind> = TypeSkell<'F a ..y -> F a ..x -> F a ..y', { F: F }>;
}

/**
 * SemiAlternative is a typeclass that defines a single operation, or.
 * It is an associative operation that allows you to combine two effects.
 *
 * Laws:
 *   Associativity: `a or (b or c) = (a or b) or c`
 *   Left Distributivity: `map f (a or b) = (map f a) or (map f b)`
 *
 */
export interface SemiAlternative<F extends Kind> extends Functor<F> {
  or: SemiAlternative.$or<F>;
}
