import * as tfunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import { TAsyncIO } from './async-io.types';
import * as I from '@data/io';
import * as A from '@data/async';

export const Of: tOf.Of<TAsyncIO> = {
  of: a => I.of(A.of(a)),
};

export const Zero: tZero.Zero<TAsyncIO> = {
  zero: () => I.of(A.zero()),
};

export const Functor: tfunctor.Functor<TAsyncIO> = {
  map: tfunctor.mapCompose(I.Functor, A.Functor),
};

export const Applicative: tApplicative.Applicative<TAsyncIO> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(I.Applicative, A.Applicative),
};

export const Monad: tMonad.Monad<TAsyncIO> = {
  ...Applicative,
  flatMap: f => I.map(A.flatMap(a => I.run(f(a)))),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TAsyncIO> = {
  ...Functor,
  orElse: fb => I.map(A.orElse(fb())),
};

export const Alternative: tAlternative.Alternative<TAsyncIO> = {
  ...Zero,
  ...Applicative,
  ...SemiAlternative,
};

export const of = Of.of;

export const zero = Zero.zero;

export const map = Functor.map;

export const mapCompose = tfunctor.mapCompose(Functor, Functor);

export const flap = tfunctor.flap(Functor);

export const as = tfunctor.as(Functor);

export const ap = Applicative.ap;

export const liftA2 = tApplicative.liftA2(Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

export const flatMap = Monad.flatMap;

export const flatten = tMonad.flatten(Monad);

export const orElse = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);
