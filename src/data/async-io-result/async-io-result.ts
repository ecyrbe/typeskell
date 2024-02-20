import * as A from '@data/async';
import * as R from '@data/result';
import * as IO from '@data/io';
import * as AIO from '@data/async-io';
import * as AO from '@data/async-option';
import * as AR from '@data/async-result';
import * as tFunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tBiFunctor from '@typeclass/bifunctor';
import * as tFlip from '@typeclass/flip';
import * as tBiFlatMap from '@typeclass/biflatmap';
import { AsyncIOResult, TAsyncIOResult } from './async-io-result.types';
import { flow, pipe } from '@utils/pipe';

export const ok = <A, E = never>(a: A): AsyncIOResult<A, E> => AIO.of(R.ok(a));
export const err = <E, A = never>(e: E): AsyncIOResult<A, E> => AIO.of(R.err(e));

export const Of: tOf.Of<TAsyncIOResult> = {
  of: ok,
};

export const Functor: tFunctor.Functor<TAsyncIOResult> = {
  map: tFunctor.mapCompose(AIO.Functor, R.Functor),
};

export const BiFunctor: tBiFunctor.BiFunctor<TAsyncIOResult> = {
  bimap: (f, g) => AIO.map(R.bimap(f, g)),
};

export const Flip: tFlip.Flip<TAsyncIOResult> = {
  flip: AIO.map(R.flip),
};

export const Applicative: tApplicative.Applicative<TAsyncIOResult> = {
  ...Functor,
  ...Of,
  ap: tApplicative.apCompose(AIO.Applicative, R.Applicative),
};

export const Monad: tMonad.Monad<TAsyncIOResult> = {
  ...Applicative,
  flatMap: f => AIO.flatMap(R.match(f, err as any)),
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TAsyncIOResult> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) => AIO.flatMap(R.match(f, g)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TAsyncIOResult> = {
  ...Functor,
  orElse: f => AIO.flatMap(R.match(ok as any, f)),
};

export const fromIO: <A, E = never>(io: IO.IO<A>) => AsyncIOResult<A, E> = IO.map(AR.ok);

export const fromAsync: <A, E = never>(a: A.Async<A>) => AsyncIOResult<A, E> = a => () => pipe(a, A.map(R.of));

export const fromAsyncOption: <A, E = never>(onErr: () => E) => (ao: AO.AsyncOption<A>) => AsyncIOResult<A, E> =
  onErr => ao => () =>
    pipe(ao, A.map(R.fromOption(onErr)));

export const fromAsyncResult: <A, E>(a: AR.AsyncResult<A, E>) => AsyncIOResult<A, E> = a => () => a;

export const fromAsyncIO: <A, E = never>(a: AIO.AsyncIO<A>) => AsyncIOResult<A, E> = AIO.map(R.of);

export const of = Of.of;

export const map = Functor.map;

export const mapCompose = tFunctor.mapCompose(Functor, Functor);

export const flap = tFunctor.flap(Functor);

export const as = tFunctor.as(Functor);

export const tap = tFunctor.tap(Functor);

export const bimap = BiFunctor.bimap;

export const mapLeft = tBiFunctor.mapLeft(BiFunctor);

export const mapRight = tBiFunctor.mapRight(BiFunctor);

export const mapErr = mapRight;

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
