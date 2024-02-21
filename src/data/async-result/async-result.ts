import * as R from '@data/result';
import * as A from '@data/async';
import * as tFunctor from '@typeclass/functor';
import * as tbifunctor from '@typeclass/bifunctor';
import * as tOf from '@typeclass/of';
import * as tFlip from '@typeclass/flip';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import * as tSemiAlternative from '@typeclass/semialternative';
import { AsyncResult, TAsyncResult } from './async-result.types';

export const ok = <A, E = never>(a: A): AsyncResult<A, E> => A.of(R.ok(a));
export const err = <E, A = never>(e: E): AsyncResult<A, E> => A.of(R.err(e));

export const Of: tOf.Of<TAsyncResult> = {
  of: ok,
};

export const Functor: tFunctor.Functor<TAsyncResult> = {
  map: tFunctor.mapCompose(A.Functor, R.Functor),
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
  flatMap: f => A.flatMap(R.match(f, err as any)),
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TAsyncResult> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) => A.flatMap(R.match(f, g)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TAsyncResult> = {
  ...Functor,
  orElse: f => A.flatMap(R.match(ok as any, f)),
};

export const of = Of.of;

export const map = Functor.map;

export const mapCompose = tFunctor.mapCompose(Functor, Functor);

export const flap = tFunctor.flap(Functor);

export const as = tFunctor.as(Functor);

export const tap = tFunctor.tap(Functor);

export const bimap = BiFunctor.bimap;

export const mapLeft = tbifunctor.mapLeft(BiFunctor);

export const mapRight = tbifunctor.mapRight(BiFunctor);

export const mapErr = mapRight;

export const bitap = tbifunctor.bitap(BiFunctor);

export const tapLeft = tbifunctor.tapLeft(BiFunctor);

export const tapRight = tbifunctor.tapRight(BiFunctor);

export const tapErr = tapRight;

export const flip = Flip.flip;

export const ap = Applicative.ap;

export const liftA2 = tApplicative.liftA2(Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

export const flatMap = Monad.flatMap;

export const chain = flatMap;

export const andThen = flatMap;

export const flatten = tMonad.flatten(Monad);

export const biFlatMap = BiFlatMap.biFlatMap;

export const orElse = tBiFlatMap.orElse(BiFlatMap);

export const alt = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);
