import { Kind } from '@kinds';
import * as tFunctor from '@typeclass/functor';
import { type Of as tOf } from '@typeclass/of';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tCoMonad from '@typeclass/comonad';
import * as tFoldable from '@typeclass/foldable';

export type NonEmptyArray<A> = [A, ...A[]];

export interface TNonEmptyArray extends Kind.unary {
  return: NonEmptyArray<this['arg0']>;
}

export const isNonEmptyArray = <A>(arr: A[]): arr is NonEmptyArray<A> => arr.length > 0;

export const Of: tOf<TNonEmptyArray> = {
  of: a => [a],
};

export const Functor: tFunctor.Functor<TNonEmptyArray> = {
  map: f => fa => fa.map(f) as NonEmptyArray<ReturnType<typeof f>>,
};

export const Foldable: tFoldable.Foldable<TNonEmptyArray> = {
  reduce: (f, b) => fa => fa.reduce(f, b),
};

export const NonEmptyFoldable: tFoldable.Foldable1<TNonEmptyArray> = {
  ...Foldable,
  fold: f => fa => fa.reduce(f),
};

export const Applicative: tApplicative.Applicative<TNonEmptyArray> = {
  ...Of,
  ...Functor,
  ap: fa => fab => fab.flatMap(f => fa.map(f)) as NonEmptyArray<ReturnType<(typeof fab)[0]>>,
};

export const Monad: tMonad.Monad<TNonEmptyArray> = {
  ...Applicative,
  flatMap: f => fa => fa.flatMap(f) as ReturnType<typeof f>,
};

export const CoMonad: tCoMonad.CoMonad<TNonEmptyArray> = {
  ...Of,
  ...Functor,
  extract: fa => fa[0],
  extend: f => fa => fa.map((_, i, as) => f(as.slice(i) as any)) as any,
};

export const of = Of.of;

export const map = Functor.map;

export const reduce = Foldable.reduce;

export const fold = NonEmptyFoldable.fold;

export const ap = Applicative.ap;

export const flatMap = Monad.flatMap;

export const extract = CoMonad.extract;

export const extend = CoMonad.extend;

export const duplicate = tCoMonad.duplicate(CoMonad);
