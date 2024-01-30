import type { Kind } from '@kinds';
import { some, none } from '@data/option';
import type { Filterable } from './filterable';

export const filter: (filterable: Filterable<Kind.F>) => Filterable.$filter<Kind.F> = filterable => f =>
  filterable.filterMap(a => (f(a) ? some(a) : none()));
