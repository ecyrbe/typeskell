import { Kind } from '@kinds';
import * as tfunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import type { Reader, TReader } from './reader.types';
import { identity } from '@utils/functions';

export const ask: <Env>() => Reader<Env, Env> = () => identity;

export const asks: <Env, A>(f: (env: Env) => A) => Reader<A, Env> = identity;

export const local: <Env1, Env2>(f: (env: Env2) => Env1) => <A>(fa: Reader<A, Env1>) => Reader<A, Env2> =
  f => fa => env =>
    fa(f(env));

export const askReader: <Env1, Env2, A>(f: (env: Env1) => Reader<A, Env2>) => Reader<A, Env1 & Env2> = f => env =>
  f(env)(env);

export const runReader: <Env, A>(fa: Reader<A, Env>) => (env: Env) => A = fa => env => fa(env);

export const Of: tOf.Of<TReader> = {
  of: a => () => a,
};

export const Functor: tfunctor.Functor<TReader> = {
  map: f => fa => r => f(fa(r)),
};

export const Applicative: tApplicative.Applicative<TReader> = {
  ...Of,
  ...Functor,
  ap: fa => fab => r => fab(r)(fa(r)),
};

export const Monad: tMonad.Monad<TReader> = {
  ...Applicative,
  flatMap: f => fa => r => f(fa(r))(r),
};

export const of = Of.of;

export const map = Functor.map;

export const mapCompose = tfunctor.mapCompose(Functor, Functor);

export const flap = tfunctor.flap(Functor);

export const as = tfunctor.as(Functor);

export const ap = Applicative.ap;

export const liftA2 = tApplicative.liftA2(Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

export const flatMap = Monad.flatMap;

export const andThen = flatMap;

export const chain = flatMap;

export const flatten = tMonad.flatten(Monad);

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
