import { Kind } from '@kinds';
import * as R from '@data/result';
import * as IO from '@data/io';
import * as tFunctor from '@typeclass/functor';
import * as tBiFunctor from '@typeclass/bifunctor';
import * as tOf from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tFlip from '@typeclass/flip';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import * as tFoldable from '@typeclass/foldable';
import * as tTraversable from '@typeclass/traversable';
import * as tSemiAlternative from '@typeclass/semialternative';
import { pipe } from '@utils/pipe';

export interface IOResult<A, E> extends IO.IO<R.Result<A, E>> {}

export interface TIOResult extends Kind.binary {
  return: IOResult<this['arg0'], this['arg1']>;
}

export const err: <E, A = never>(e: E) => IOResult<A, E> = e => () => R.err(e);

export const ok: <A, E = never>(a: A) => IOResult<A, E> = a => () => R.ok(a);

export const run = <A, E>(io: IOResult<A, E>): R.Result<A, E> => io();

export const Of: tOf.Of<TIOResult> = {
  of: ok,
};

export const BiFunctor: tBiFunctor.BiFunctor<TIOResult> = {
  bimap: (f, g) => IO.map(R.bimap(f, g)),
};

export const Functor: tFunctor.Functor<TIOResult> = {
  map: tFunctor.mapCompose(IO.Functor, R.Functor),
};

export const To: tTo.To<TIOResult> = {
  getOrElse: f => io => pipe(run(io), R.getOrElse(f)),
};

export const Flip: tFlip.Flip<TIOResult> = {
  flip: IO.map(R.flip),
};

export const Applicative: tApplicative.Applicative<TIOResult> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(IO.Applicative, R.Applicative),
};

export const Monad: tMonad.Monad<TIOResult> = {
  ...Applicative,
  flatMap: f => IO.map(R.flatMap(a => run(f(a)))),
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TIOResult> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) =>
    IO.map(
      R.biFlatMap(
        a => run(f(a)),
        e => run(g(e)),
      ),
    ),
};

export const Foldable: tFoldable.Foldable<TIOResult> = {
  reduce: (f, b) => io => pipe(run(io), R.reduce(f, b)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TIOResult> = {
  ...Functor,
  orElse: fb => fa => () => pipe(fa, IO.map(R.orElse(fb())))(),
};

const $traverse: (
  applicative: tApplicative.Applicative<Kind.F>,
) => tTraversable.Traversable.$traverse<TIOResult, Kind.F> = applicative => f => fa =>
  pipe(fa(), R.traverse(applicative)(f), applicative.map(IO.of));

export const Traversable: tTraversable.Traversable<TIOResult> = {
  ...Functor,
  ...Foldable,
  traverse: $traverse as any,
};

export const fromIO: <A, E = never>(io: IO.IO<A>) => IOResult<A, E> = IO.map(R.ok);

export const fromResult: <A, E>(r: R.Result<A, E>) => IOResult<A, E> = IO.of;

export const of = Of.of;

export const getOrElse = To.getOrElse;

export const getOr = tTo.getOr(To);

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

export const flip = Flip.flip;

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

export const reduce = Foldable.reduce;

export const alt = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);

export const traverse: <F extends Kind>(
  F: tApplicative.Applicative<F>,
) => tTraversable.Traversable.$traverse<TIOResult, F> = Traversable.traverse as any;

export const sequence: <F extends Kind>(
  F: tApplicative.Applicative<F>,
) => tTraversable.Traversable.$sequence<TIOResult, F> = tTraversable.sequence(Traversable) as any;

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
