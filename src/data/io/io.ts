import { Kind } from '@kinds';
import * as tfunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';

export interface IO<A> {
  (): A;
}

export interface TIO extends Kind.unary {
  return: IO<this['arg0']>;
}

export const Zero: tZero.Zero<TIO> = {
  zero: () => () => {
    throw new Error('Zero IO');
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

export const Functor: tfunctor.Functor<TIO> = {
  map: f => io => of(f(io())),
};

export const Applicative: tApplicative.Applicative<TIO> = {
  ...Of,
  ...Functor,
  ap: fa => fab => () => fab()(fa()),
};

export const Monad: tMonad.Monad<TIO> = {
  ...Applicative,
  flatMap: f => fa => f(fa()),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TIO> = {
  ...Functor,
  or: fb => fa => () => {
    try {
      return fa();
    } catch {
      return fb();
    }
  },
};

export const Alternative: tAlternative.Alternative<TIO> = {
  ...Zero,
  ...Applicative,
  ...SemiAlternative,
};

export const zero = Zero.zero;

export const of = Of.of;

export const getOrElse = To.getOrElse;

export const getOr = tTo.getOr(To);

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

export const flatten = tMonad.flatten(Monad);

export const or = SemiAlternative.or;

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
