import * as tOf from '@typeclass/of';
import * as tFunctor from '@typeclass/functor';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import type { ReaderTask, TReaderTask } from './reader-task.types';
import * as IO from '@data/io';
import * as T from '@data/task';
import * as Reader from '@data/reader';
import { pipe } from '@utils/pipe';

export const ask: <Env>() => ReaderTask<Env, Env> = () => env => T.of(env);

export const asks: <Env, A>(f: (env: Env) => A) => ReaderTask<A, Env> = f => env => () => T.of(f(env))();

export const local: <Env1, Env2>(f: (env: Env2) => Env1) => <A>(fa: ReaderTask<A, Env1>) => ReaderTask<A, Env2> =
  f => fa => env =>
    fa(f(env));

export const askReader: <Env1, Env2, A>(f: (env: Env1) => ReaderTask<A, Env2>) => ReaderTask<A, Env1 & Env2> =
  f => env =>
    f(env)(env);

export const Of: tOf.Of<TReaderTask> = {
  of: a => () => T.of(a),
};

export const Functor: tFunctor.Functor<TReaderTask> = {
  map: tFunctor.mapCompose(Reader.Functor, T.Functor),
};

export const Applicative: tApplicative.Applicative<TReaderTask> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(Reader.Applicative, T.Applicative),
};

export const Monad: tMonad.Monad<TReaderTask> = {
  ...Applicative,
  flatMap: f => fa => env =>
    pipe(
      fa(env),
      T.flatMap(a => f(a)(env)),
    ),
};

export const fromIO: <Env, A>(fa: IO.IO<A>) => ReaderTask<A, Env> = fa => env => T.fromIO(fa);

export const of = Of.of;

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

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
