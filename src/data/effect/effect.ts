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
import * as T from '@data/task';
import * as TO from '@data/task-option';
import * as TR from '@data/task-result';
import * as Reader from '@data/reader';
import * as RIO from '@data/reader-io';
import * as RIOO from '@data/reader-io-option';
import * as RIOR from '@data/reader-io-result';
import * as RT from '@data/reader-task';
import * as RTO from '@data/reader-task-option';
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

export const ok: <A, E = never, Env = unknown>(a: A) => Effect<A, E, Env> = a => RT.of(R.ok(a));
export const err: <E, A = never, Env = unknown>(e: E) => Effect<A, E, Env> = e => RT.of(R.err(e));

export const Of: tOf.Of<TEffect> = {
  of: ok,
};

export const Functor: tFunctor.Functor<TEffect> = {
  map: tFunctor.mapCompose(RT.Functor, R.Functor),
};

export const BiFunctor: tBiFunctor.BiFunctor<TEffect> = {
  bimap: (f, g) => RT.map(R.bimap(f, g)),
};

export const Applicative: tApplicative.Applicative<TEffect> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(RT.Applicative, R.Applicative),
};

export const Monad: tMonad.Monad<TEffect> = {
  ...Applicative,
  flatMap: f => RT.flatMap(R.match(f, err as any)) as any,
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TEffect> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) => RT.flatMap(R.match(f, g)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TEffect> = {
  ...Functor,
  orElse: f => RT.flatMap(R.match(ok as any, f)) as any,
};

/******************************
 *  Context free constructors *
 ******************************/
export const fromOption: <A, E = never, Env = unknown>(onErr: () => E) => (o: O.Option<A>) => Effect<A, E, Env> =
  onErr => o =>
    RT.of(pipe(o, R.fromOption(onErr)));

export const fromResult: <A, E, Env = unknown>(r: R.Result<A, E>) => Effect<A, E, Env> = r => RT.of(r);

export const fromIO: <A, E = never, Env = unknown>(io: IO.IO<A>) => Effect<A, E, Env> = io => env =>
  pipe(io, IO.map(AR.ok));

export const fromIOOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (ioo: IOO.IOOption<A>) => Effect<A, E, Env> = onErr => ioo => env => async () =>
  pipe(ioo, IO.map(R.fromOption(onErr)))();

export const fromIOResult: <A, E, Env = unknown>(ior: IOR.IOResult<A, E>) => Effect<A, E, Env> =
  ior => env => async () =>
    ior();

export const fromAsync: <A, E = never, Env = unknown>(a: A.Async<A>) => Effect<A, E, Env> = flow(A.map(R.ok), RIO.of);

export const fromAsyncOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (ao: AO.AsyncOption<A>) => Effect<A, E, Env> = onErr => flow(A.map(R.fromOption(onErr)), RIO.of);

export const fromAsyncResult: <A, E, Env = unknown>(ar: AR.AsyncResult<A, E>) => Effect<A, E, Env> = RIO.of;

export const fromTask: <A, E = never, Env = unknown>(io: T.Task<A>) => Effect<A, E, Env> = flow(T.map(R.ok), Reader.of);

export const fromTaskOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (aioo: TO.TaskOption<A>) => Effect<A, E, Env> = onErr => flow(T.map(R.fromOption(onErr)), Reader.of);

export const fromTaskResult: <A, E, Env = unknown>(aior: TR.TaskResult<A, E>) => Effect<A, E, Env> = Reader.of;

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

export const fromReaderTask: <A, E = never, Env = unknown>(io: RT.ReaderTask<A, Env>) => Effect<A, E, Env> = RT.map(
  R.ok,
);

export const fromReaderTaskOption: <A, E = never, Env = unknown>(
  onErr: () => E,
) => (ioo: RTO.ReaderTaskOption<A, Env>) => Effect<A, E, Env> = onErr => RT.map(R.fromOption(onErr));

export const tryCatch: <A, E1, Env>(
  $catch: (e: unknown) => E1,
) => <E2>(fa: Effect<A, E2, Env>) => Effect<A, E1 | E2, Env> = $catch => fa => env => async () => {
  try {
    return fa(env)();
  } catch (e) {
    return R.err($catch(e));
  }
};

export const of = Of.of;

export const map = Functor.map;

export const mapCompose = tFunctor.mapCompose(Functor, Functor);

export const flap = tFunctor.flap(Functor);

export const as = tFunctor.as(Functor);

export const tap = tFunctor.tap(Functor);

export const bimap = BiFunctor.bimap;

export const mapLeft = tBiFunctor.mapLeft(BiFunctor);

export const mapRight = tBiFunctor.mapRight(BiFunctor);

export const mapErr = mapRight;

export const bitap = tBiFunctor.bitap(BiFunctor);

export const tapLeft = tBiFunctor.tapLeft(BiFunctor);

export const tapRight = tBiFunctor.tapRight(BiFunctor);

export const tapErr = tapRight;

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
