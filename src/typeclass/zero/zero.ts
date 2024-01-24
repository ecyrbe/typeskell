import type { Kind } from '@kinds';
import type { TypeSkell } from '@typeskell';

export namespace Zero {
  export type $zero<F extends Kind> = TypeSkell<' -> F a ..e', { F: F }>;
}
export interface Zero<F extends Kind> {
  /**
   * zero :: `() -> F a`
   *
   * zero :: `<A,...>() => $<F, [A,...]>`
   *
   * @returns `F a`
   */
  zero: Zero.$zero<F>;
}
