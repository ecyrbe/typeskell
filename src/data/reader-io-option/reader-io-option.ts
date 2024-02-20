import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tFunctor from '@typeclass/functor';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import * as tMonad from '@typeclass/monad';
import type { ReaderIOOption, TReaderIOOption } from './reader-io-option.types';
import * as RIO from '@data/reader-io';
import * as O from '@data/option';

export const ask: <Env>() => ReaderIOOption<Env, Env> = () => env => () => O.some(env);

export const asks: <Env, A>(f: (env: Env) => A) => ReaderIOOption<A, Env> = f => env => () => O.some(f(env));

export const local: <Env1, Env2>(
  f: (env: Env2) => Env1,
) => <A>(fa: ReaderIOOption<A, Env1>) => ReaderIOOption<A, Env2> = f => fa => env => fa(f(env));

export const askReader: <Env1, Env2, A>(f: (env: Env1) => ReaderIOOption<A, Env2>) => ReaderIOOption<A, Env1 & Env2> =
  f => env =>
    f(env)(env);

export const some: <A, Env = unknown>(a: A) => ReaderIOOption<A, Env> = a => RIO.of(O.some(a));
export const none: <A = never, Env = unknown>() => ReaderIOOption<A, Env> = () => RIO.of(O.none());

export const Of: tOf.Of<TReaderIOOption> = {
  of: some,
};

export const Zero: tZero.Zero<TReaderIOOption> = {
  zero: none,
};

export const Functor: tFunctor.Functor<TReaderIOOption> = {
  map: tFunctor.mapCompose(RIO.Functor, O.Functor),
};

export const Applicative: tApplicative.Applicative<TReaderIOOption> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(RIO.Applicative, O.Applicative),
};

export const Monad: tMonad.Monad<TReaderIOOption> = {
  ...Applicative,
  flatMap: f => RIO.flatMap(O.match(f, none)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TReaderIOOption> = {
  ...Functor,
  orElse: f => RIO.flatMap(O.match(some, f)),
};

export const Alternative: tAlternative.Alternative<TReaderIOOption> = {
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
