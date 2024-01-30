import { Kind } from '@kinds';
import { SemiAlign } from './semialign';
import { pipe } from '@utils/pipe';
import { pair } from '@data/pair';

export const zip: (semiAlign: SemiAlign<Kind.F>) => SemiAlign.$zip<Kind.F> = semiAlign => fa => fb =>
  pipe(fb, pipe(fa, semiAlign.zipWith(pair)));
