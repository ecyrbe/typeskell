import type { Kind, $ } from '@kinds';
import { ToDefaultParam } from '@kinds/defaults';
import { Tail } from '@utils/tuples';

export namespace Of {
  export type $of<F extends Kind> = <A>(a: A) => $<F, [A, ...Tail<ToDefaultParam<F['signature']>>]>;
}

/**
 * Of is a typeclass that provides a way to inject a value into a type.
 */
export interface Of<F extends Kind> {
  /**
   * of :: `a -> F a`
   */
  of: Of.$of<F>;
}
