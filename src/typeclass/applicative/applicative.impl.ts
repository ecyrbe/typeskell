import type { Kind, $ } from '@kinds';
import { pipe } from '../../pipe';
import { pair } from '@data/pair';
import { Applicative } from './applicative';

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
