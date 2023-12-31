import type { Kind, $ } from '@kinds';
import { ToDefaultParam } from '@kinds/defaults';
import { Tail } from '@utils/tuples';

/**
 * Of is a typeclass that provides a way to inject a value into a type.
 */
export interface Of<F extends Kind> {
  of: <A>(a: A) => $<F, [A, ...Tail<ToDefaultParam<F['signature']>>]>;
}
