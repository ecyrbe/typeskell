import type { Kind, $ } from '@kinds';
import type { Applicative } from './applicative';
import { pair } from '@data/pair';
import { pipe } from '@utils/pipe';

export const apCompose: (
  applicativeF: Applicative<Kind.F>,
  applicativeG: Applicative<Kind.G>,
) => Applicative.$apCompose<Kind.F, Kind.G> = (applicativeF, applicativeG) => fga => fgab =>
  pipe(
    pipe(
      fgab,
      applicativeF.map(gab => (ga: $<Kind.G, Parameters<(typeof gab)['Args'][0]>>) => pipe(gab, applicativeG.ap(ga))),
    ),
    applicativeF.ap(fga),
  );

// F.map(fab, (gab) => (ga: HKT<G, A>) => G.ap(gab, ga)),
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
