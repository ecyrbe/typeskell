import * as O from '@data/option';
import * as A from '@data/async';
import * as tfunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import * as tSemiAlternative from '@typeclass/semialternative';
import { AsyncOption, TAsyncOption } from './async-option.types';
import { pipe } from '@utils/pipe';

export const some = <A>(a: A): AsyncOption<A> => A.of(O.some(a));
export const none = <A = unknown>(): AsyncOption<A> => A.of(O.none());

export const Of: tOf.Of<TAsyncOption> = {
  of: some,
};

export const Zero: tZero.Zero<TAsyncOption> = {
  zero: none,
};

export const Functor: tfunctor.Functor<TAsyncOption> = {
  map: tfunctor.mapCompose(A.Functor, O.Functor),
};

export const Applicative: tApplicative.Applicative<TAsyncOption> = {
  ...Functor,
  ...Of,
  ap: tApplicative.apCompose(A.Applicative, O.Applicative),
};

export const Monad: tMonad.Monad<TAsyncOption> = {
  ...Applicative,
  flatMap: f => fa => pipe(fa, A.flatMap(O.match(f, () => none()))),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TAsyncOption> = {
  ...Functor,
  orElse: f => async fa => {
    const a = await fa;
    if (O.isSome(a)) {
      return O.some(a.value);
    } else {
      return f();
    }
  },
};

export const of = Of.of;

export const map = Functor.map;

export const mapCompose = tfunctor.mapCompose(Functor, Functor);

export const flap = tfunctor.flap(Functor);

export const as = tfunctor.as(Functor);

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
