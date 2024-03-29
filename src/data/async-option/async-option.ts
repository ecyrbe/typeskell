import * as O from '@data/option';
import * as A from '@data/async';
import * as tFunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tNone from '@typeclass/none';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import { AsyncOption, TAsyncOption } from './async-option.types';

export const some = <A>(a: A): AsyncOption<A> => A.of(O.some(a));
export const none = <A = unknown>(): AsyncOption<A> => A.of(O.none());

export const Of: tOf.Of<TAsyncOption> = {
  of: some,
};

export const None: tNone.None<TAsyncOption> = {
  none,
};

export const Functor: tFunctor.Functor<TAsyncOption> = {
  map: tFunctor.mapCompose(A.Functor, O.Functor),
};

export const Applicative: tApplicative.Applicative<TAsyncOption> = {
  ...Functor,
  ...Of,
  ap: tApplicative.apCompose(A.Applicative, O.Applicative),
};

export const Monad: tMonad.Monad<TAsyncOption> = {
  ...Applicative,
  flatMap: f => A.flatMap(O.match(f, none as any)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TAsyncOption> = {
  ...Functor,
  orElse: f => A.flatMap(O.match(some, f)),
};

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
