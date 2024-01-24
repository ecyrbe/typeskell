import type { Kind, $ } from '@kinds';
import type { NonEmptyArray } from '@data/non-empty-array';
import type { Applicative } from './applicative';
import { pair } from '@data/pair';
import { pipe } from '../../pipe';

export const liftA2: (applicative: Applicative<Kind.F>) => Applicative.$liftA2<Kind.F> = applicative => f => fa => fb =>
  pipe(
    pipe(
      fa,
      applicative.map(a => (b: Parameters<typeof f>[1]) => f(a, b)),
    ),
    applicative.ap(fb),
  );

export const product: (applicative: Applicative<Kind.F>) => Applicative.$product<Kind.F> = applicative => fa => fb =>
  pipe(fb, pipe(fa, liftA2(applicative)(pair)));

export const productMany: (applicative: Applicative<Kind.F>) => Applicative.$productMany<Kind.F> =
  applicative => fa => faa => {
    let result = pipe(
      fa,
      applicative.map(a => [a]),
    );
    for (const a of faa) {
      result = pipe(
        pipe(a, product(applicative)(result)),
        applicative.map(arr => [...arr[0], arr[1]]),
      );
    }
    return result;
  };
