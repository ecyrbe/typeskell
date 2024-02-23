import * as O from '@data/option';
import * as IO from '@data/io';
import * as A from '@data/async';
import * as AO from '@data/async-option';
import * as T from '@data/task';
import * as tFunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import { TaskOption, TTaskOption } from './task-option.types';
import { flow, pipe } from '@utils/pipe';

export const some = <A>(a: A): TaskOption<A> => T.of(O.some(a));
export const none = <A = unknown>(): TaskOption<A> => T.of(O.none());

export const Of: tOf.Of<TTaskOption> = {
  of: some,
};

export const Zero: tZero.Zero<TTaskOption> = {
  zero: none,
};

export const Functor: tFunctor.Functor<TTaskOption> = {
  map: tFunctor.mapCompose(T.Functor, O.Functor),
};

export const Applicative: tApplicative.Applicative<TTaskOption> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(T.Applicative, O.Applicative),
};

export const Monad: tMonad.Monad<TTaskOption> = {
  ...Applicative,
  flatMap: f => T.flatMap(O.match(f, none as any)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TTaskOption> = {
  ...Functor,
  orElse: f => T.flatMap(O.match(some, f)),
};

export const fromIO: <A>(io: IO.IO<A>) => TaskOption<A> = IO.map(AO.of);

export const fromAsync: <A>(a: A.Async<A>) => TaskOption<A> = a => () => pipe(a, A.map(O.of));

export const fromAsyncOption: <A>(a: AO.AsyncOption<A>) => TaskOption<A> = IO.of;

export const fromTask: <A>(a: T.Task<A>) => TaskOption<A> = T.map(O.of);

export const of = Of.of;

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

export const chain = flatMap;

export const andThen = flatMap;

export const flatten = tMonad.flatten(Monad);

export const orElse = SemiAlternative.orElse;

export const alt = orElse;

export const or = tSemiAlternative.or(SemiAlternative);
