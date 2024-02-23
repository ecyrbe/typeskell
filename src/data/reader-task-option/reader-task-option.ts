import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tFunctor from '@typeclass/functor';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import * as tMonad from '@typeclass/monad';
import type { ReaderTaskOption, TReaderTaskOption } from './reader-task-option.types';
import * as RT from '@data/reader-task';
import * as O from '@data/option';

export const ask: <Env>() => ReaderTaskOption<Env, Env> = () => env => async () => O.some(env);

export const asks: <Env, A>(f: (env: Env) => A) => ReaderTaskOption<A, Env> = f => env => async () => O.some(f(env));

export const local: <Env1, Env2>(
  f: (env: Env2) => Env1,
) => <A>(fa: ReaderTaskOption<A, Env1>) => ReaderTaskOption<A, Env2> = f => fa => env => fa(f(env));

export const askReader: <Env1, Env2, A>(
  f: (env: Env1) => ReaderTaskOption<A, Env2>,
) => ReaderTaskOption<A, Env1 & Env2> = f => env => f(env)(env);

export const some: <A, Env = unknown>(a: A) => ReaderTaskOption<A, Env> = a => RT.of(O.some(a));
export const none: <A = never, Env = unknown>() => ReaderTaskOption<A, Env> = () => RT.of(O.none());

export const Of: tOf.Of<TReaderTaskOption> = {
  of: some,
};

export const Zero: tZero.Zero<TReaderTaskOption> = {
  zero: none,
};

export const Functor: tFunctor.Functor<TReaderTaskOption> = {
  map: tFunctor.mapCompose(RT.Functor, O.Functor),
};

export const Applicative: tApplicative.Applicative<TReaderTaskOption> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(RT.Applicative, O.Applicative),
};

export const Monad: tMonad.Monad<TReaderTaskOption> = {
  ...Applicative,
  flatMap: f => RT.flatMap(O.match(f, none)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TReaderTaskOption> = {
  ...Functor,
  orElse: f => RT.flatMap(O.match(some, f)),
};

export const Alternative: tAlternative.Alternative<TReaderTaskOption> = {
  ...Zero,
  ...Applicative,
  ...SemiAlternative,
};

export const of = Of.of;

export const zero = Zero.zero;

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

export const orElse = SemiAlternative.orElse;

export const alt = orElse;

export const or = tSemiAlternative.or(SemiAlternative);

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
