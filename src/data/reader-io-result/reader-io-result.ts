import * as tOf from '@typeclass/of';
import * as tFunctor from '@typeclass/functor';
import * as tBiFunctor from '@typeclass/bifunctor';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import type { ReaderIOResult, TReaderIOResult } from './reader-io-result.types';
import * as RIO from '@data/reader-io';
import * as R from '@data/result';

export const ask: <E, Env>() => ReaderIOResult<Env, E, Env> = () => env => () => R.ok(env);

export const asks: <A, E, Env>(f: (env: Env) => A) => ReaderIOResult<A, E, Env> = f => env => () => R.ok(f(env));

export const local: <Env1, Env2>(
  f: (env: Env2) => Env1,
) => <A, E>(fa: ReaderIOResult<A, E, Env1>) => ReaderIOResult<A, E, Env2> = f => fa => env => fa(f(env));

export const askReader: <Env1, Env2, A, E>(
  f: (env: Env1) => ReaderIOResult<A, E, Env2>,
) => ReaderIOResult<A, E, Env1 & Env2> = f => env => f(env)(env);

export const ok: <A, E = never, Env = unknown>(a: A) => ReaderIOResult<A, E, Env> = a => RIO.of(R.ok(a));
export const err: <E, A = never, Env = unknown>(e: E) => ReaderIOResult<A, E, Env> = e => RIO.of(R.err(e));

export const Of: tOf.Of<TReaderIOResult> = {
  of: ok,
};

export const Functor: tFunctor.Functor<TReaderIOResult> = {
  map: tFunctor.mapCompose(RIO.Functor, R.Functor),
};

export const BiFunctor: tBiFunctor.BiFunctor<TReaderIOResult> = {
  bimap: (f, g) => RIO.map(R.bimap(f, g)),
};

export const Applicative: tApplicative.Applicative<TReaderIOResult> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(RIO.Applicative, R.Applicative),
};

export const Monad: tMonad.Monad<TReaderIOResult> = {
  ...Applicative,
  flatMap: f => RIO.flatMap(R.match(f, err as any)) as any,
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TReaderIOResult> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) => RIO.flatMap(R.match(f, g)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TReaderIOResult> = {
  ...Functor,
  orElse: f => RIO.flatMap(R.match(ok as any, f)) as any,
};

export const of = Of.of;

export const map = Functor.map;

export const bimap = BiFunctor.bimap;

export const mapLeft = tBiFunctor.mapLeft(BiFunctor);

export const mapRight = tBiFunctor.mapRight(BiFunctor);

export const mapErr = mapRight;

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

export const biFlatMap = BiFlatMap.biFlatMap;

export const orElse = tBiFlatMap.orElse(BiFlatMap);

export const alt = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
