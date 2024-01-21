import { Kind } from '@kinds';
import { Functor } from '@typeclass/functor';
import { TypeSkell } from '@typeskell';
import { TOption } from '@data/option';
import { filter as filterImpl } from './filterable.impl';
import { Zero } from '@typeclass/zero';

/**
 * Filterable is a typeclass that extends Functor and Zero.
 * It provides a filterMap method that allows you to filter and map at the same time.
 *
 * Laws:
 * - Composition: filterMap f . map g = filterMap (f . g)
 * - Annihilation: filterMap (const none) = zero
 * - Identity: filterMap (const (some a)) = map (const a)
 */
export interface Filterable<F extends Kind> extends Functor<F>, Zero<F> {
  filterMap: TypeSkell<'(a -> Option b) -> F a ..e -> F b ..e', { F: F; Option: TOption }>;
}

export const filter: <F extends Kind>(
  filterable: Filterable<F>,
) => TypeSkell<'(a -> boolean) -> F a ..e -> F a ..e', { F: F }> = filterImpl as any;

export type FilterSignature<F extends Kind> = ReturnType<typeof filter<F>>;
