import { Kind } from '@kinds';
import * as R from '@data/result';
import * as A from '@data/async';
import * as tfunctor from '@typeclass/functor';
import * as tbifunctor from '@typeclass/bifunctor';
import * as tOf from '@typeclass/of';
import * as tFlip from '@typeclass/flip';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import * as tSemiAlternative from '@typeclass/semialternative';
import { AsyncResult, TAsyncResult } from './async-result.types';

export const ok = <A, E = unknown>(a: A): AsyncResult<A, E> => A.of(R.ok(a));
export const err = <E, A = unknown>(e: E): AsyncResult<A, E> => A.of(R.err(e));

export const Of: tOf.Of<TAsyncResult> = {
  of: ok,
};

export const Functor: tfunctor.Functor<TAsyncResult> = {
  map: tfunctor.mapCompose(A.Functor, R.Functor),
};

export const BiFunctor: tbifunctor.BiFunctor<TAsyncResult> = {
  bimap: (f, g) => A.map(R.bimap(f, g)),
};

export const Flip: tFlip.Flip<TAsyncResult> = {
  flip: A.map(R.flip),
};

export const Applicative: tApplicative.Applicative<TAsyncResult> = {
  ...Functor,
  ...Of,
  ap: tApplicative.apCompose(A.Applicative, R.Applicative),
};

export const Monad: tMonad.Monad<TAsyncResult> = {
  ...Applicative,
  flatMap: f => async fa => {
    const a = await fa;
    if (R.isOk(a)) {
      return f(a.ok);
    } else {
      return R.err(a.err);
    }
  },
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TAsyncResult> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) => async fa => {
    const a = await fa;
    if (R.isOk(a)) {
      return f(a.ok);
    } else {
      return g(a.err);
    }
  },
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TAsyncResult> = {
  ...Functor,
  orElse: f => async fa => {
    const a = await fa;
    if (R.isOk(a)) {
      return R.ok(a.ok);
    } else {
      return f();
    }
  },
};
