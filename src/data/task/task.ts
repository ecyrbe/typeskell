import * as tFunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import { Task, TTask } from './task.types';
import * as I from '@data/io';
import * as A from '@data/async';

export const Of: tOf.Of<TTask> = {
  of: a => I.of(A.of(a)),
};

export const Zero: tZero.Zero<TTask> = {
  zero: () => I.of(A.zero()),
};

export const Functor: tFunctor.Functor<TTask> = {
  map: tFunctor.mapCompose(I.Functor, A.Functor),
};

export const Applicative: tApplicative.Applicative<TTask> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(I.Applicative, A.Applicative),
};

export const Monad: tMonad.Monad<TTask> = {
  ...Applicative,
  flatMap: f => I.map(A.flatMap(a => I.run(f(a)))),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TTask> = {
  ...Functor,
  orElse: fb => I.map(A.orElse(fb())),
};

export const Alternative: tAlternative.Alternative<TTask> = {
  ...Zero,
  ...Applicative,
  ...SemiAlternative,
};

export const fromIO: <A>(io: I.IO<A>) => Task<A> = I.map(A.of);

export const fromAsync: <A>(async: A.Async<A>) => Task<A> = I.of;

export const of = Of.of;

export const zero = Zero.zero;

export const map = Functor.map;

export const mapCompose = tFunctor.mapCompose(Functor, Functor);

export const flap = tFunctor.flap(Functor);

export const as = tFunctor.as(Functor);

export const tap = tFunctor.tap(Functor);

export const ap = Applicative.ap;

export const liftA2 = tApplicative.liftA2(Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

export const flatMap = Monad.flatMap;

export const flatten = tMonad.flatten(Monad);

export const orElse = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);
