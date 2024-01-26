import { Kind } from '@kinds';
import { TypeSkell } from '@typeskell';

export namespace Foldable {
  export type $reduce<F extends Kind> = TypeSkell<'(b a -> b) b -> F a ..e -> b', { F: F }>;
  export type $fold<F extends Kind> = TypeSkell<'(a a -> a) -> F a ..e -> a', { F: F }>;
}

export interface Foldable<F extends Kind> {
  reduce: Foldable.$reduce<F>;
}

export interface Foldable1<F extends Kind> extends Foldable<F> {
  fold: Foldable.$fold<F>;
}
