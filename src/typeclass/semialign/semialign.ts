import { Kind } from '@kinds';
import { TPair } from '@data/pair';
import { TypeSkell } from '@typeskell';
import { zip as zipImpl } from './semialign.impl';

/**
 * SemiAlign is a typeclass for types that can be zipped together.
 * it is a weaker version of Align.
 * ZipWith has the same signature as Applicative liftA2 but with different laws.
 */
export interface SemiAlign<F extends Kind> {
  /**
   * zipWith :: `(a b -> c) -> F a -> F b -> F c`
   */
  zipWith: TypeSkell<'(a b -> c) -> F a ..x -> F b ..y -> F c ..xy', { F: F }>;
}

/**
 * zip :: `SemiAlign F => F a -> F b -> F (Pair a b)`
 */
export const zip: <F extends Kind>(
  semiAlign: SemiAlign<F>,
) => TypeSkell<'F a ..x -> F b ..y -> F (Pair a b) ..xy', { F: F; Pair: TPair }> = zipImpl as any;
