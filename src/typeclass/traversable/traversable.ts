import type { Kind } from '@kinds';
import type { Applicative } from '@typeclass/applicative';
import type { Functor } from '@typeclass/functor';
import type { TypeSkell } from '@typeskell';
import { sequence as sequenceImpl } from './traversable.impl';

/**
 * Traversable is a typeclass that provides a way to traverse a data structure with an effect.
 *
 * Laws:
 * - Naturality: t . traverse f = traverse (t . f)
 * - Identity: traverse Identity = Identity
 * - Composition: traverse (Compose . fmap g . f) = Compose . fmap (traverse g) . traverse f
 */
export interface Traversable<T extends Kind> extends Functor<T> {
  traverse: <F extends Kind>(
    F: Applicative<F>,
  ) => TypeSkell<'(a -> F b ..x) -> T a ..y -> F (T b ..y) ..x', { F: F; T: T }>;
}

export const sequence: <T extends Kind>(
  traversable: Traversable<T>,
) => <F extends Kind>(F: Applicative<F>) => TypeSkell<'T (F a ..x) ..y -> F (T a ..y) ..x', { F: F; T: T }> =
  sequenceImpl as any;
