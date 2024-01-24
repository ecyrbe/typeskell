import type { Kind, $ } from '@kinds';
import type { Applicative } from '@typeclass/applicative';
import { identity } from '@utils/functions';
import { pipe } from '../../pipe';
import type { Traversable } from './traversable';

export const sequence: (
  traversable: Traversable<Kind.F>,
) => (applicative: Applicative<Kind.H>) => Traversable.$sequence<Kind.F, Kind.H> = traversable => applicative =>
  traversable.traverse(applicative)(identity);
