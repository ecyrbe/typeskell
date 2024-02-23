import type { Kind } from '@kinds';
import type { TypeSkell } from '@typeskell';

export namespace None {
  export type $none<F extends Kind> = TypeSkell<' -> F a ..e', { F: F }>;
}
export interface None<F extends Kind> {
  /**
   * none :: `() -> F a`
   *
   * none :: `<A,...>() => $<F, [A,...]>`
   *
   * @returns `F a`
   */
  none: None.$none<F>;
}
