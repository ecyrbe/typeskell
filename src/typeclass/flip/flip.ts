import { Kind } from '@kinds';
import { TypeSkell } from '@typeskell';
import { e } from 'vitest/dist/reporters-O4LBziQ_';

export namespace Flip {
  export type $flip<F extends Kind> = TypeSkell<'F a b ..e -> F b a ..e', { F: F }>;
}

export interface Flip<F extends Kind> {
  /**
   * flip :: `F a b -> F b a`
   */
  flip: Flip.$flip<F>;
}
