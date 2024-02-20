import * as tOf from '@typeclass/of';
import * as tFunctor from '@typeclass/functor';
import * as tBiFunctor from '@typeclass/bifunctor';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import type { Effect, TEffect } from './effect.types';
import * as O from '@data/option';
import * as R from '@data/result';
import * as IO from '@data/io';
import * as IOO from '@data/io-option';
import * as IOR from '@data/io-result';
import * as A from '@data/async';
import * as AO from '@data/async-option';
import * as AR from '@data/async-result';
import * as AIO from '@data/async-io';
import * as AIOO from '@data/async-io-option';
import * as AIOR from '@data/async-io-result';
import * as RIO from '@data/reader-io';
import * as RIOO from '@data/reader-io-option';
import * as RIOR from '@data/reader-io-result';
import * as ARIO from '@data/async-reader-io';
import * as ARIOO from '@data/async-reader-io-option';
import { pipe, flow } from '@utils/pipe';
import { UnexpectedError } from '@utils/errors';

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

/******************************
 *  Context free constructors *
 ******************************/
export const fromOption: <A, E = never, Env = unknown>(onErr: () => E) => (o: O.Option<A>) => Effect<A, E, Env> =
  onErr => o =>
    ARIO.of(pipe(o, R.fromOption(onErr)));

export const fromResult: <A, E, Env = unknown>(r: R.Result<A, E>) => Effect<A, E, Env> = r => ARIO.of(r);

export const fromIO: <A, E = never, Env = unknown>(io: IO.IO<A>) => Effect<A, E, Env> = io => env =>
  pipe(io, IO.map(AR.ok));

export const fromIOOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (ioo: IOO.IOOption<A>) => Effect<A, E, Env> = onErr => ioo => env => async () =>
  pipe(ioo, IO.map(R.fromOption(onErr)))();

export const fromIOResult: <A, E, Env = unknown>(ior: IOR.IOResult<A, E>) => Effect<A, E, Env> =
  ior => env => async () =>
    ior();

export const fromAsync: <A, E = never, Env = unknown>(a: A.Async<A>) => Effect<A, E, Env> = a => env => () =>
  pipe(a, A.map(R.ok));

export const fromAsyncOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (ao: AO.AsyncOption<A>) => Effect<A, E, Env> = onErr => ao => env => () => pipe(ao, A.map(R.fromOption(onErr)));

export const fromAsyncResult: <A, E, Env = unknown>(ar: AR.AsyncResult<A, E>) => Effect<A, E, Env> = ar => env => () =>
  ar;

export const fromAsyncIO: <A, E = never, Env = unknown>(io: AIO.AsyncIO<A>) => Effect<A, E, Env> = aio => env =>
  pipe(aio, AIO.map(R.ok));

export const fromAsyncIOOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (aioo: AIOO.AsyncIOOption<A>) => Effect<A, E, Env> = onErr => aioo => env =>
  pipe(aioo, AIO.map(R.fromOption(onErr)));

export const fromAsyncIOResult: <A, E, Env = unknown>(aior: AIOR.AsyncIOResult<A, E>) => Effect<A, E, Env> =
  aior => env =>
    aior;

/******************************
 * Context aware constructors *
 ******************************/
export const fromReader: <A, E = never, Env = unknown>(f: (env: Env) => A) => Effect<A, E, Env> =
  f => env => async () =>
    R.ok(f(env));

export const fromReaderIO: <A, E = never, Env = unknown>(io: RIO.ReaderIO<A, Env>) => Effect<A, E, Env> = RIO.map(
  AR.ok,
);

export const fromReaderIOOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (ioo: RIOO.ReaderIOOption<A, Env>) => Effect<A, E, Env> = onErr => RIO.map(flow(R.fromOption(onErr), A.of));

export const fromReaderIOResult: <A, E, Env = unknown>(ior: RIOR.ReaderIOResult<A, E, Env>) => Effect<A, E, Env> =
  RIO.map(A.of);

export const fromAsyncReader: <A, E = never, Env = unknown>(f: (env: Env) => A.Async<A>) => Effect<A, E, Env> =
  f => env => async () =>
    R.ok(await f(env));

export const fromAsyncReaderIO: <A, E = never, Env = unknown>(io: ARIO.AsyncReaderIO<A, Env>) => Effect<A, E, Env> =
  ARIO.map(R.ok);

export const fromAsyncReaderIOOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (ioo: ARIOO.AsyncReaderIOOption<A, Env>) => Effect<A, E, Env> = onErr => ARIO.map(R.fromOption(onErr));

const $catch: <A, E1, Env>(f: (e: unknown) => E1) => <E2>(fa: Effect<A, E2, Env>) => Effect<A, E1 | E2, Env> =
  f => fa => env => async () => {
    try {
      return fa(env)();
    } catch (e) {
      return R.err(f(e));
    }
  };

export { $catch as catch };

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
