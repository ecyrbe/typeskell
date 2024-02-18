import * as tOf from '@typeclass/of';
import * as tFunctor from '@typeclass/functor';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import type { AsyncReaderIO, TAsyncReaderIO } from './async-reader-io.types';
import * as AIO from '@data/async-io';
import * as Reader from '@data/reader';
import { pipe } from '@utils/pipe';

export const ask: <Env>() => AsyncReaderIO<Env, Env> = () => env => AIO.of(env);

export const asks: <Env, A>(f: (env: Env) => A) => AsyncReaderIO<A, Env> = f => env => () => AIO.of(f(env))();

export const local: <Env1, Env2>(f: (env: Env2) => Env1) => <A>(fa: AsyncReaderIO<A, Env1>) => AsyncReaderIO<A, Env2> =
  f => fa => env =>
    fa(f(env));

export const askReader: <Env1, Env2, A>(f: (env: Env1) => AsyncReaderIO<A, Env2>) => AsyncReaderIO<A, Env1 & Env2> =
  f => env =>
    f(env)(env);

export const Of: tOf.Of<TAsyncReaderIO> = {
  of: a => () => AIO.of(a),
};

export const Functor: tFunctor.Functor<TAsyncReaderIO> = {
  map: tFunctor.mapCompose(Reader.Functor, AIO.Functor),
};

export const Applicative: tApplicative.Applicative<TAsyncReaderIO> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(Reader.Applicative, AIO.Applicative),
};

export const Monad: tMonad.Monad<TAsyncReaderIO> = {
  ...Applicative,
  flatMap: f => fa => env =>
    pipe(
      fa(env),
      AIO.flatMap(a => f(a)(env)),
    ),
};

export const of = Of.of;

export const map = Functor.map;

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

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
