import { Kind } from '@kinds';
import * as tFunctor from '@typeclass/functor';
import { type Of as tOf } from '@typeclass/of';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tCoMonad from '@typeclass/comonad';
import * as tFoldable from '@typeclass/foldable';
import { ArrayFull, TArrayFull } from './arrayfull.types';

export const isArrayFull = <A>(arr: A[]): arr is ArrayFull<A> => arr.length > 0;

export const Of: tOf<TArrayFull> = {
  of: a => [a],
};

export const Functor: tFunctor.Functor<TArrayFull> = {
  map: f => fa => fa.map(f) as ArrayFull<ReturnType<typeof f>>,
};

export const Foldable: tFoldable.Foldable<TArrayFull> = {
  reduce: (f, b) => fa => fa.reduce(f, b),
};

export const NonEmptyFoldable: tFoldable.Foldable1<TArrayFull> = {
  ...Foldable,
  fold1: f => fa => fa.reduce(f),
};

export const Applicative: tApplicative.Applicative<TArrayFull> = {
  ...Of,
  ...Functor,
  ap: fa => fab => fab.flatMap(f => fa.map(f)) as ArrayFull<ReturnType<(typeof fab)[0]>>,
};

export const Monad: tMonad.Monad<TArrayFull> = {
  ...Applicative,
  flatMap: f => fa => fa.flatMap(f) as ReturnType<typeof f>,
};

export const CoMonad: tCoMonad.CoMonad<TArrayFull> = {
  ...Of,
  ...Functor,
  extract: fa => fa[0],
  extend: f => fa => fa.map((_, i, as) => f(as.slice(i) as any)) as any,
};

export const of = Of.of;

export const map = Functor.map;

export const flap = tFunctor.flap(Functor);

export const as = tFunctor.as(Functor);

export const tap = tFunctor.tap(Functor);

export const reduce = Foldable.reduce;

export const fold1 = NonEmptyFoldable.fold1;

export const ap = Applicative.ap;

export const flatMap = Monad.flatMap;

export const extract = CoMonad.extract;

export const extend = CoMonad.extend;

export const duplicate = tCoMonad.duplicate(CoMonad);

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
