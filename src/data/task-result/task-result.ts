import * as A from '@data/async';
import * as R from '@data/result';
import * as IO from '@data/io';
import * as T from '@data/task';
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
import { TaskResult, TTaskResult } from './task-result.types';
import { pipe } from '@utils/pipe';

export const ok = <A, E = never>(a: A): TaskResult<A, E> => T.of(R.ok(a));
export const err = <E, A = never>(e: E): TaskResult<A, E> => T.of(R.err(e));

export const Of: tOf.Of<TTaskResult> = {
  of: ok,
};

export const Functor: tFunctor.Functor<TTaskResult> = {
  map: tFunctor.mapCompose(T.Functor, R.Functor),
};

export const BiFunctor: tBiFunctor.BiFunctor<TTaskResult> = {
  bimap: (f, g) => T.map(R.bimap(f, g)),
};

export const Flip: tFlip.Flip<TTaskResult> = {
  flip: T.map(R.flip),
};

export const Applicative: tApplicative.Applicative<TTaskResult> = {
  ...Functor,
  ...Of,
  ap: tApplicative.apCompose(T.Applicative, R.Applicative),
};

export const Monad: tMonad.Monad<TTaskResult> = {
  ...Applicative,
  flatMap: f => T.flatMap(R.match(f, err as any)),
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TTaskResult> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) => T.flatMap(R.match(f, g)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TTaskResult> = {
  ...Functor,
  orElse: f => T.flatMap(R.match(ok as any, f)),
};

export const fromIO: <A, E = never>(io: IO.IO<A>) => TaskResult<A, E> = IO.map(AR.ok);

export const fromAsync: <A, E = never>(a: A.Async<A>) => TaskResult<A, E> = a => () => pipe(a, A.map(R.of));

export const fromAsyncOption: <A, E = never>(onErr: () => E) => (ao: AO.AsyncOption<A>) => TaskResult<A, E> =
  onErr => ao => () =>
    pipe(ao, A.map(R.fromOption(onErr)));

export const fromAsyncResult: <A, E>(a: AR.AsyncResult<A, E>) => TaskResult<A, E> = a => () => a;

export const fromTask: <A, E = never>(a: T.Task<A>) => TaskResult<A, E> = T.map(R.of);

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

export const bitap = tBiFunctor.bitap(BiFunctor);

export const tapLeft = tBiFunctor.tapLeft(BiFunctor);

export const tapRight = tBiFunctor.tapRight(BiFunctor);

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
