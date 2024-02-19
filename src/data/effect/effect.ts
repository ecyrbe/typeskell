import * as tOf from '@typeclass/of';
import * as tFunctor from '@typeclass/functor';
import * as tBiFunctor from '@typeclass/bifunctor';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import type { Effect, TEffect } from './effect.types';
import * as ARIO from '@data/async-reader-io';
import * as R from '@data/result';

export const ask: <E, Env>() => Effect<Env, E, Env> = () => env => async () => R.ok(env);

export const asks: <A, E, Env>(f: (env: Env) => A) => Effect<A, E, Env> = f => env => async () => R.ok(f(env));

export const local: <Env1, Env2>(f: (env: Env2) => Env1) => <A, E>(fa: Effect<A, E, Env1>) => Effect<A, E, Env2> =
  f => fa => env =>
    fa(f(env));

export const askReader: <Env1, Env2, A, E>(f: (env: Env1) => Effect<A, E, Env2>) => Effect<A, E, Env1 & Env2> =
  f => env =>
    f(env)(env);

export const ok: <A, E = never, Env = unknown>(a: A) => Effect<A, E, Env> = a => ARIO.of(R.ok(a));
export const err: <E, A = never, Env = unknown>(e: E) => Effect<A, E, Env> = e => ARIO.of(R.err(e));

export const Of: tOf.Of<TEffect> = {
  of: ok,
};

export const Functor: tFunctor.Functor<TEffect> = {
  map: tFunctor.mapCompose(ARIO.Functor, R.Functor),
};

export const BiFunctor: tBiFunctor.BiFunctor<TEffect> = {
  bimap: (f, g) => ARIO.map(R.bimap(f, g)),
};

export const Applicative: tApplicative.Applicative<TEffect> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(ARIO.Applicative, R.Applicative),
};

export const Monad: tMonad.Monad<TEffect> = {
  ...Applicative,
  flatMap: f => ARIO.flatMap(R.match(f, err as any)) as any,
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TEffect> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) => ARIO.flatMap(R.match(f, g)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TEffect> = {
  ...Functor,
  orElse: f => ARIO.flatMap(R.match(ok as any, f)) as any,
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
