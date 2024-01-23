import { Kind, $ } from '@kinds';
import { SemiAlign } from './semialign';
import { pipe } from '../../pipe';
import { pair } from '@data/pair';

export const zip =
  (semiAlign: SemiAlign<Kind.F>) =>
  <A>(fa: $<Kind.F, [A]>) =>
  <B>(fb: $<Kind.F, [B]>) =>
    pipe(fb, pipe(fa, semiAlign.zipWith(pair)));
