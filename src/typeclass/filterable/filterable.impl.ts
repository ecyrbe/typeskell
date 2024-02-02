import type { Kind } from '@kinds';
import { some, none } from '@data/option';
import type { Filterable } from './filterable';
import { identity } from '@utils/functions';

export const $filter: (filterable: Filterable<Kind.F>) => Filterable.$filter<Kind.F> = filterable => f =>
  filterable.filterMap(a => (f(a) ? some(a) : none()));

export const $compact: (filterable: Filterable<Kind.F>) => Filterable.$compact<Kind.F> = filterable =>
  filterable.filterMap(identity);
