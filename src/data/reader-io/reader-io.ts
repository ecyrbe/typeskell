import * as tOf from '@typeclass/of';
import * as tFunctor from '@typeclass/functor';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import type { ReaderIO, TReaderIO } from './reader-io.types';
import * as IO from '@data/io';
import * as Reader from '@data/reader';
import { pipe } from '@utils/pipe';

export const ask: <Env>() => ReaderIO<Env, Env> = () => env => () => env;

export const asks: <Env, A>(f: (env: Env) => A) => ReaderIO<A, Env> = f => env => () => f(env);

export const local: <Env1, Env2>(f: (env: Env2) => Env1) => <A>(fa: ReaderIO<A, Env1>) => ReaderIO<A, Env2> =
  f => fa => env =>
    fa(f(env));

export const askReader: <Env1, Env2, A>(f: (env: Env1) => ReaderIO<A, Env2>) => ReaderIO<A, Env1 & Env2> = f => env =>
  f(env)(env);

export const runReader: <Env, A>(fa: ReaderIO<A, Env>) => (env: Env) => A = fa => env => fa(env)();

export const Of: tOf.Of<TReaderIO> = {
  of: a => () => () => a,
};

export const Functor: tFunctor.Functor<TReaderIO> = {
  map: tFunctor.mapCompose(Reader.Functor, IO.Functor),
};

export const Applicative: tApplicative.Applicative<TReaderIO> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(Reader.Applicative, IO.Applicative),
};

export const Monad: tMonad.Monad<TReaderIO> = {
  ...Applicative,
  flatMap: f => fa => env =>
    pipe(
      fa(env),
      IO.flatMap(a => f(a)(env)),
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
