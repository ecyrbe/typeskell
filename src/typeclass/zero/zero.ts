import type { Kind } from '@kinds';
import type { TypeSkell } from '@typeskell';

export interface Zero<F extends Kind> {
  /**
   * zero :: `() -> F a`
   *
   * zero :: `<A,...>() => $<F, [A,...]>`
   *
   * @returns `F a`
   */
  zero: TypeSkell<' -> F a ..e', { F: F }>;
}
