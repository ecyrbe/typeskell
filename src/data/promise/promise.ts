import * as tfunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import { TPromise } from './promise.types';
import { pipe } from '@utils/pipe';

export const Of: tOf.Of<TPromise> = {
  of: Promise.resolve,
};

export const Zero: tZero.Zero<TPromise> = {
  zero: () => Promise.reject('Zero Promise'),
};

export const Functor: tfunctor.Functor<TPromise> = {
  /**
   * Promise then is not compatible with functor laws, so we need to wrap the result in a Promise so we workaround thenable objects
   * @param f
   * @returns
   */
  map: f => fa => fa.then(a => of(f(a))),
};

export const Applicative: tApplicative.Applicative<TPromise> = {
  ...Of,
  ...Functor,
  ap: fa => flatMap(f => pipe(fa, map(f))),
};

export const Monad: tMonad.Monad<TPromise> = {
  ...Applicative,
  flatMap: Functor.map,
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TPromise> = {
  ...Functor,
  orElse: fb => fa => fa.catch(() => fb()),
};

export const Alternative: tAlternative.Alternative<TPromise> = {
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

export const apCompose = tApplicative.apCompose(Applicative, Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

export const flatMap = Monad.flatMap;

export const andThen = flatMap;

export const chain = flatMap;

export const flatten = tMonad.flatten(Monad);

export const orElse = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);
