import type { Kind } from '@kinds';
import type * as tfunctor from '@typeclass/functor';
import type * as tOf from '@typeclass/of';
import type * as tTo from '@typeclass/to';
import type * as tNone from '@typeclass/none';
import type * as tSemiAlign from '@typeclass/semialign';
import type * as tMonad from '@typeclass/monad';
import type * as tFoldable from '@typeclass/foldable';
import type * as tFilterable from '@typeclass/filterable';
import type * as tTraversable from '@typeclass/traversable';
import type * as tSemiAlternative from '@typeclass/semialternative';
import type * as tAlternative from '@typeclass/alternative';
import * as tApplicative from '@typeclass/applicative';
import * as O from '@data/option';
import { pipe } from '@utils/pipe';
import type { TArray } from './array.types';

export const None: tNone.None<TArray> = {
  none: () => [],
};

export const Of: tOf.Of<TArray> = {
  of: a => [a],
};

export const from = <A>(fa: Iterable<A>) => [...fa];

export const To: tTo.To<TArray> = {
  getOrElse: f => fa => (fa.length === 0 ? f() : fa[0]),
};

export const OptionalTo: tTo.OptionalTo<TArray> = {
  ...To,
  get: fa => (fa.length === 0 ? O.none() : O.some(fa[0])),
};

export const Functor: tfunctor.Functor<TArray> = {
  map: f => fa => fa.map(f),
};

export const Foldable: tFoldable.Foldable<TArray> = {
  reduce: (f, b) => fa => fa.reduce(f, b),
};

export const Filterable: tFilterable.Filterable<TArray> = {
  ...None,
  ...Functor,
  filterMap: f => fa => {
    const result: O.OptionParamOf<ReturnType<typeof f>>[] = [];
    for (const a of fa) {
      const b = f(a);
      if (O.isSome(b)) {
        result.push(b.value);
      }
    }
    return result;
  },
};

export const Applicative: tApplicative.Applicative<TArray> = {
  ...Of,
  ...Functor,
  ap: fa => fab => fab.flatMap(f => fa.map(f)),
};

export const SemiAlign: tSemiAlign.SemiAlign<TArray> = {
  zipWith: f => fa => fb => {
    const result: ReturnType<typeof f>[] = [];
    const minLength = Math.min(fa.length, fb.length);
    for (let i = 0; i < minLength; i++) {
      result.push(f(fa[i], fb[i]));
    }
    return result;
  },
};

export const Monad: tMonad.Monad<TArray> = {
  ...Applicative,
  flatMap: f => fa => fa.flatMap(f),
};

const traverseImpl: (
  applicative: tApplicative.Applicative<Kind.F>,
) => tTraversable.Traversable.$traverse<TArray, Kind.F> = applicative => f => fa =>
  fa.reduce(
    (acc, x) =>
      pipe(
        acc,
        pipe(
          f(x),
          tApplicative.liftA2(applicative)((a, b) => (b.push(a), b)),
        ),
      ),
    applicative.of<ReturnType<typeof f>['Args'][0][]>([]),
  );

export const Traversable: tTraversable.Traversable<TArray> = {
  ...Functor,
  ...Foldable,
  traverse: traverseImpl as any,
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TArray> = {
  ...Functor,
  orElse: fb => fa => fa.concat(fb()),
};

export const Alternative: tAlternative.Alternative<TArray> = {
  ...None,
  ...Applicative,
  ...SemiAlternative,
};
