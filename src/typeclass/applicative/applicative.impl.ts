import type { Kind, $ } from '@kinds';
import type { NonEmptyArray } from '@data/non-empty-array';
import type { Applicative } from './applicative';
import { pair } from '@data/pair';
import { pipe } from '../../pipe';

export const liftA2 =
  (applicative: Applicative<Kind.F>) =>
  <A, B, C>(f: (a: A, b: B) => C) =>
  (fa: $<Kind.F, [A]>) =>
  (fb: $<Kind.F, [B]>) =>
    pipe(
      pipe(
        fa,
        applicative.map(a => (b: B) => f(a, b)),
      ),
      applicative.ap(fb),
    );

export const product =
  (applicative: Applicative<Kind.F>) =>
  <A>(fa: $<Kind.F, [A]>) =>
  <B>(fb: $<Kind.F, [B]>) =>
    pipe(fb, pipe(fa, liftA2(applicative)(pair)));

export const productMany =
  (applicative: Applicative<Kind.F>) =>
  <A>(fa: $<Kind.F, [A]>) =>
  (faa: Iterable<$<Kind.F, [A]>>) => {
    let result = pipe(
      fa,
      applicative.map((a): NonEmptyArray<A> => [a]),
    );
    for (const a of faa) {
      result = pipe(
        pipe(a, product(applicative)(result)),
        applicative.map(arr => [...arr[0], arr[1]]),
      );
    }
    return result;
  };
