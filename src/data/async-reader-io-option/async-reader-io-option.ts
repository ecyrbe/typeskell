import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tFunctor from '@typeclass/functor';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import * as tMonad from '@typeclass/monad';
import type { AsyncReaderIOOption, TAsyncReaderIOOption } from './async-reader-io-option.types';
import * as ARIO from '@data/async-reader-io';
import * as O from '@data/option';

export const ask: <Env>() => AsyncReaderIOOption<Env, Env> = () => env => async () => O.some(env);

export const asks: <Env, A>(f: (env: Env) => A) => AsyncReaderIOOption<A, Env> = f => env => async () => O.some(f(env));

export const local: <Env1, Env2>(
  f: (env: Env2) => Env1,
) => <A>(fa: AsyncReaderIOOption<A, Env1>) => AsyncReaderIOOption<A, Env2> = f => fa => env => fa(f(env));

export const askReader: <Env1, Env2, A>(
  f: (env: Env1) => AsyncReaderIOOption<A, Env2>,
) => AsyncReaderIOOption<A, Env1 & Env2> = f => env => f(env)(env);

export const some: <A, Env = unknown>(a: A) => AsyncReaderIOOption<A, Env> = a => ARIO.of(O.some(a));
export const none: <A = never, Env = unknown>() => AsyncReaderIOOption<A, Env> = () => ARIO.of(O.none());

export const Of: tOf.Of<TAsyncReaderIOOption> = {
  of: some,
};

export const Zero: tZero.Zero<TAsyncReaderIOOption> = {
  zero: none,
};

export const Functor: tFunctor.Functor<TAsyncReaderIOOption> = {
  map: tFunctor.mapCompose(ARIO.Functor, O.Functor),
};

export const Applicative: tApplicative.Applicative<TAsyncReaderIOOption> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(ARIO.Applicative, O.Applicative),
};

export const Monad: tMonad.Monad<TAsyncReaderIOOption> = {
  ...Applicative,
  flatMap: f => ARIO.flatMap(O.match(f, none)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TAsyncReaderIOOption> = {
  ...Functor,
  orElse: f => ARIO.flatMap(O.match(some, f)),
};

export const Alternative: tAlternative.Alternative<TAsyncReaderIOOption> = {
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
