import type { Kind } from '@kinds';
import type { Functor } from '@typeclass/functor';
import type { None } from '@typeclass/none';
import type { TypeSkell } from '@typeskell';
import type { TOption } from '@data/option/option.types';
import { $filter, $compact } from './filterable.impl';

export namespace Filterable {
  export type $filterMap<F extends Kind> = TypeSkell<
    '(a -> Option b) -> F a ..e -> F b ..e',
    { F: F; Option: TOption }
  >;

  export type $filter<F extends Kind> = TypeSkell<'(a -> boolean) -> F a ..e -> F a ..e', { F: F }>;

  export type $compact<F extends Kind> = TypeSkell<'F (Option a) ..e -> F a ..e', { F: F; Option: TOption }>;
}

/**
 * Filterable is a typeclass that extends Functor and None.
 * It provides a filterMap method that allows you to filter and map at the same time.
 *
 * Laws:
 * - Composition: filterMap f . map g = filterMap (f . g)
 * - Annihilation: filterMap (const none) = none
 * - Identity: filterMap (const (some a)) = map (const a)
 */
export interface Filterable<F extends Kind> extends Functor<F>, None<F> {
  filterMap: Filterable.$filterMap<F>;
}

export const filter: <F extends Kind>(filterable: Filterable<F>) => Filterable.$filter<F> = $filter as any;

export const compact: <F extends Kind>(filterable: Filterable<F>) => Filterable.$compact<F> = $compact as any;
