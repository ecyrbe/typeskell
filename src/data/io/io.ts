import * as tFunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tNone from '@typeclass/none';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import type { TIO, IO } from './io.types';
import { identity } from '@utils/functions';

export const run = <A>(io: IO<A>): A => io();

export const None: tNone.None<TIO> = {
  none: () => () => {
    throw new Error('Empty IO');
  },
};

export const Of: tOf.Of<TIO> = {
  of: a => () => a,
};

export const To: tTo.To<TIO> = {
  getOrElse: f => fa => {
    try {
      return fa();
    } catch {
      return f();
    }
  },
};

export const Functor: tFunctor.Functor<TIO> = {
  map: f => io => () => f(run(io)),
};

export const Applicative: tApplicative.Applicative<TIO> = {
  ...Of,
  ...Functor,
  ap: fa => fab => () => run(fab)(run(fa)),
};

export const Monad: tMonad.Monad<TIO> = {
  ...Applicative,
  flatMap: f => io => () => run(f(run(io))),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TIO> = {
  ...Functor,
  orElse: fb => fa => () => {
    try {
      return run(fa);
    } catch {
      return run(fb());
    }
  },
};

export const Alternative: tAlternative.Alternative<TIO> = {
  ...None,
  ...Applicative,
  ...SemiAlternative,
};

export const fromIO: <A>(io: IO<A>) => IO<A> = identity;

export const of = Of.of;

export const none = None.none;

export const getOrElse = To.getOrElse;

export const getOr = tTo.getOr(To);

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

export const andThen = flatMap;

export const chain = flatMap;

export const flatten = tMonad.flatten(Monad);

export const orElse = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
