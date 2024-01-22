import type { Kind, $ } from '@kinds';
import { some, none } from '@data/option';
import type { Filterable } from './filterable';
import { pipe } from '../../pipe';

export const filter: (
  filterable: Filterable<Kind.F>,
) => <A>(f: (a: A) => boolean) => (fa: $<Kind.F, [A]>) => $<Kind.F, [A]> = filterable => f => fa =>
  pipe(
    fa,
    filterable.filterMap(a => (f(a) ? some(a) : none())),
  );
