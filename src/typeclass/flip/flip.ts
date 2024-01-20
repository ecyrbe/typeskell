import { Kind } from '@kinds';
import { TypeSkell } from '@typeskell';

export interface Flip<F extends Kind> {
  flip: TypeSkell<'F a b ..e -> F b a ..e', { F: F }>;
}
