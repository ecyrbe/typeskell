import { Kind, $ } from '@kinds';
import * as tfunctor from '@typeclass/functor';
import { type Of as tOf } from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlign from '@typeclass/semialign';
import * as tMonad from '@typeclass/monad';
import * as tFoldable from '@typeclass/foldable';
import * as tFilterable from '@typeclass/filterable';
import * as tTraversable from '@typeclass/traversable';
import * as tGroups from '@typeclass/groups';
import { OptionOf, isSome, none, some } from '../option';
import { map, flatMap, filterMap, zipWith } from './operators';
import { reduce } from './reducers';
import { pipe } from '@utils/pipe';

export interface TGenerator extends Kind.unary {
  return: Generator<this['arg0']>;
}

export const Zero: tZero.Zero<TGenerator> = {
  zero: function* () {
    return;
  },
};

export const Of: tOf<TGenerator> = {
  of: function* (a) {
    yield a;
  },
};

export const To: tTo.To<TGenerator> = {
  getOrElse: f => fa => {
    const next = fa.next();
    return next.done ? f() : next.value;
  },
};

export const Functor: tfunctor.Functor<TGenerator> = {
  map,
};

export const Applicative: tApplicative.Applicative<TGenerator> = {
  ...Of,
  ...Functor,
  ap: fa =>
    function* (fab) {
      for (const f of fab) {
        for (const a of fa) {
          yield f(a);
        }
      }
    },
};

export const Monad: tMonad.Monad<TGenerator> = {
  ...Applicative,
  flatMap,
};

export const Foldable: tFoldable.Foldable<TGenerator> = {
  reduce,
};

export const Filterable: tFilterable.Filterable<TGenerator> = {
  ...Zero,
  ...Functor,
  filterMap,
};

export const SemiAlign: tSemiAlign.SemiAlign<TGenerator> = {
  zipWith,
};

export function* range(start: number, end: number = Infinity, step: number = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

export function* repeat<T>(item: T, count: number = Infinity) {
  for (let i = 0; i < count; i++) {
    yield item;
  }
}

export function* concatMany<T>(...faa: Generator<T>[]) {
  for (const fa of faa) {
    yield* fa;
  }
}
