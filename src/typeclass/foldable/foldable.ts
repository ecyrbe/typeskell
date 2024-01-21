import { Kind } from '@kinds';
import { TypeSkell } from '@typeskell';
import { Monoid } from '@typeclass/groups';

export interface Foldable<F extends Kind> {
  reduce: TypeSkell<'(b a -> b) b -> F a ..e -> b', { F: F }>;
}

export interface NonEmptyFoldable<F extends Kind> extends Foldable<F> {
  fold: TypeSkell<'(a a -> a) -> F a ..e -> a', { F: F }>;
}
